import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Lazily create Razorpay instance only when credentials are configured
function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || keyId.startsWith('rzp_test_XXXX') || !keySecret || keySecret === 'XXXXXXXXXXXXXXXXXXXX') {
    return null;
  }

  // Dynamic import to handle missing credentials gracefully
  const Razorpay = require('razorpay');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function timingSafeCompare(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// POST /api/payments/create-order
router.post('/create-order', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    if (!orderId) throw new AppError(400, 'orderId is required');

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new AppError(404, 'Order not found');
    if (order.userId !== req.session.userId) throw new AppError(403, 'Access denied');
    if (order.paymentStatus === 'PAID') throw new AppError(400, 'Order already paid');

    const razorpay = getRazorpay();
    if (!razorpay) {
      throw new AppError(503, 'Online payments are not configured. Please use Cash on Delivery.');
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.total, // already in paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order.id },
    });

    await prisma.payment.update({
      where: { orderId: order.id },
      data: { gatewayOrderId: razorpayOrder.id },
    });

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: razorpayOrder.id,
      name: 'Krishnavedic Oil & Masalas',
      description: `Order ${order.orderNumber}`,
      prefill: {},
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/verify
router.post('/verify', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      throw new AppError(400, 'Missing payment verification parameters');
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret || keySecret === 'XXXXXXXXXXXXXXXXXXXX') {
      throw new AppError(503, 'Payment verification not configured');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new AppError(404, 'Order not found');
    if (order.userId !== req.session.userId) throw new AppError(403, 'Access denied');

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (!timingSafeCompare(expectedSignature, razorpay_signature)) {
      // Record failed attempt
      await prisma.payment.update({
        where: { orderId: order.id },
        data: {
          status: 'FAILED',
          failureReason: 'Signature verification failed',
          gatewayPaymentId: razorpay_payment_id,
          gatewaySignature: razorpay_signature,
        },
      });
      throw new AppError(400, 'Payment verification failed. Please contact support.');
    }

    // Verified — update order
    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId: order.id },
        data: {
          status: 'PAID',
          gatewayPaymentId: razorpay_payment_id,
          gatewaySignature: razorpay_signature,
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED', paymentStatus: 'PAID' },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: 'CONFIRMED',
          note: `Payment verified — ${razorpay_payment_id}`,
          createdBy: req.session.userId,
        },
      }),
    ]);

    res.json({ message: 'Payment verified successfully', orderNumber: order.orderNumber });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/webhook (raw body — configured in app.ts before json())
router.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret || webhookSecret === 'XXXXXXXXXXXXXXXXXXXX') {
      return res.status(200).json({ status: 'webhook not configured' });
    }

    const receivedSig = req.headers['x-razorpay-signature'] as string;
    const body = req.body; // raw Buffer due to express.raw()

    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (!timingSafeCompare(expectedSig, receivedSig)) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = JSON.parse(body.toString());
    const { event: eventType, payload } = event;

    // Check for duplicate
    if (payload?.payment?.entity?.id) {
      const paymentId = payload.payment.entity.id;
      const payment = await prisma.payment.findFirst({
        where: { gatewayPaymentId: paymentId },
        include: { events: true },
      });

      if (payment) {
        const isDuplicate = payment.events.some((e) => {
          const p = JSON.parse(e.payload);
          return p.event === eventType;
        });
        if (isDuplicate) return res.status(200).json({ status: 'duplicate webhook ignored' });

        await prisma.paymentEvent.create({
          data: {
            paymentId: payment.id,
            eventType,
            payload: body.toString(),
          },
        });

        if (eventType === 'payment.captured') {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'PAID', gatewayPaymentId: paymentId },
            }),
            prisma.order.update({
              where: { id: payment.orderId },
              data: { status: 'CONFIRMED', paymentStatus: 'PAID' },
            }),
          ]);
        } else if (eventType === 'payment.failed') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'FAILED',
              failureReason: payload.payment.entity.error_description || 'Payment failed',
            },
          });
        }
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
});

export default router;
