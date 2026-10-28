import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { checkoutSchema } from '@krishnavedic/shared';
import { nanoid } from 'nanoid';

const router = Router();

// Calculate shipping charge based on rules
async function calculateShipping(subtotal: number): Promise<number> {
  const rules = await prisma.shippingRule.findMany({
    where: { isActive: true },
    orderBy: { minOrderValue: 'asc' },
  });

  for (const rule of rules) {
    if (
      subtotal >= rule.minOrderValue &&
      (rule.maxOrderValue === null || subtotal < rule.maxOrderValue)
    ) {
      return rule.charge;
    }
  }
  // Default shipping if no rule matches
  return 4900; // ₹49
}

// Validate and get coupon discount
async function applyCoupon(
  code: string,
  subtotal: number,
  userId?: string,
): Promise<{ coupon: any; discount: number }> {
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.isActive) throw new AppError(400, 'Invalid or expired coupon');

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) throw new AppError(400, 'Coupon is not yet active');
  if (coupon.expiresAt && coupon.expiresAt < now) throw new AppError(400, 'Coupon has expired');
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    throw new AppError(400, 'Coupon usage limit reached');
  }
  if (subtotal < coupon.minOrderValue) {
    throw new AppError(
      400,
      `Minimum order value of ₹${coupon.minOrderValue / 100} required for this coupon`,
    );
  }

  if (userId && coupon.maxUsesPerUser > 0) {
    const userUses = await prisma.couponRedemption.count({
      where: { couponId: coupon.id, userId },
    });
    if (userUses >= coupon.maxUsesPerUser) {
      throw new AppError(400, 'You have already used this coupon');
    }
  }

  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = Math.round((subtotal * coupon.discountValue) / 10000);
  } else {
    discount = coupon.discountValue;
  }
  discount = Math.min(discount, subtotal);

  return { coupon, discount };
}

// POST /api/checkout/validate
// Server validates cart, prices, stock and returns order preview
router.post('/validate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const couponCode = typeof req.body?.couponCode === 'string' ? req.body.couponCode.trim() : undefined;
    const userId = req.session.userId;
    const guestId = req.session.guestId;

    // Get cart
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { guestId: guestId || '' },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    });

    if (!cart || cart.items.length === 0) throw new AppError(400, 'Cart is empty');

    // Validate every item against current DB prices and stock
    const validatedItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: { select: { name: true, status: true } } },
      });

      if (!variant || variant.product.status !== 'PUBLISHED') {
        throw new AppError(400, `"${item.variant.product.name}" is no longer available`);
      }
      if (variant.stock < item.quantity) {
        throw new AppError(400, `Insufficient stock for "${variant.product.name} — ${variant.name}"`);
      }

      const itemSubtotal = variant.price * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        variantId: variant.id,
        productName: variant.product.name,
        variantName: variant.name,
        sku: variant.sku,
        price: variant.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    let discountAmount = 0;
    let couponData = null;
    if (couponCode) {
      const { coupon, discount } = await applyCoupon(couponCode, subtotal, userId);
      discountAmount = discount;
      couponData = coupon;
    }

    const shippingCharge = await calculateShipping(subtotal - discountAmount);
    const taxAmount = 0; // Tax configured per product if needed
    const total = subtotal - discountAmount + shippingCharge + taxAmount;

    res.json({
      items: validatedItems,
      subtotal,
      discountAmount,
      shippingCharge,
      taxAmount,
      total,
      coupon: couponData ? { code: couponData.code, description: couponData.description } : null,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/checkout/place-order
router.post('/place-order', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = checkoutSchema.parse(req.body);
    const userId = req.session.userId;
    const guestId = req.session.guestId;

    // Idempotency key to prevent duplicates
    const idempotencyKey = req.headers['x-idempotency-key'] as string;
    if (idempotencyKey) {
      const existing = await prisma.order.findUnique({ where: { idempotencyKey } });
      if (existing) {
        return res.json({
          order: { id: existing.id, orderNumber: existing.orderNumber },
          message: 'Order already placed',
        });
      }
    }

    // Resolve shipping address
    let shippingAddress: any = null;
    if (data.addressId) {
      const addr = await prisma.address.findUnique({ where: { id: data.addressId } });
      if (!addr || (userId && addr.userId !== userId)) throw new AppError(400, 'Invalid address');
      shippingAddress = addr;
    } else if (data.newAddress) {
      shippingAddress = data.newAddress;
    }
    if (!shippingAddress) throw new AppError(400, 'Shipping address is required');

    // Get cart
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { guestId: guestId || '' },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    });
    if (!cart || cart.items.length === 0) throw new AppError(400, 'Cart is empty');

    // Full server-side validation in a transaction
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of cart.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: { select: { name: true, status: true } } },
        });

        if (!variant || variant.product.status !== 'PUBLISHED') {
          throw new AppError(400, `"${item.variant.product.name}" is no longer available`);
        }
        if (variant.stock < item.quantity) {
          throw new AppError(
            400,
            `Insufficient stock for "${variant.product.name} — ${variant.name}"`,
          );
        }

        // Reserve stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });

        const itemSubtotal = variant.price * item.quantity;
        subtotal += itemSubtotal;

        orderItemsData.push({
          variantId: variant.id,
          productName: variant.product.name,
          variantName: variant.name,
          sku: variant.sku,
          priceSnapshot: variant.price,
          quantity: item.quantity,
          subtotal: itemSubtotal,
        });
      }

      let discountAmount = 0;
      let couponId: string | null = null;
      if (data.couponCode) {
        const { coupon, discount } = await applyCoupon(data.couponCode, subtotal, userId);
        discountAmount = discount;
        couponId = coupon.id;
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      const shippingCharge = await calculateShipping(subtotal - discountAmount);
      const total = subtotal - discountAmount + shippingCharge;

      const orderNumber = `KV-${Date.now()}-${nanoid(6).toUpperCase()}`;

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: data.paymentMethod,
          subtotal,
          discountAmount,
          shippingCharge,
          taxAmount: 0,
          total,
          shippingName: shippingAddress.fullName,
          shippingPhone: shippingAddress.phone,
          shippingLine1: shippingAddress.line1,
          shippingLine2: shippingAddress.line2 || null,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingPincode: shippingAddress.pincode,
          deliveryInstructions: data.deliveryInstructions || null,
          addressId: data.addressId || null,
          couponId: couponId || null,
          couponCode: data.couponCode || null,
          idempotencyKey: idempotencyKey || null,
          items: { create: orderItemsData },
        },
      });

      // Status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: createdOrder.id,
          status: 'PENDING',
          note: 'Order placed',
          createdBy: userId || null,
        },
      });

      // Record coupon redemption
      if (couponId && userId) {
        await tx.couponRedemption.create({
          data: { couponId, userId, orderId: createdOrder.id },
        });
      }

      // Inventory movement records
      for (const item of orderItemsData) {
        await tx.inventoryMovement.create({
          data: {
            variantId: item.variantId,
            quantity: -item.quantity,
            type: 'SALE',
            reason: `Order ${orderNumber}`,
            orderId: createdOrder.id,
          },
        });
      }

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: createdOrder.id,
          gateway: data.paymentMethod === 'COD' ? 'COD' : 'RAZORPAY',
          amount: total,
          status: data.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        },
      });

      // COD — confirm immediately
      if (data.paymentMethod === 'COD') {
        await tx.order.update({
          where: { id: createdOrder.id },
          data: { status: 'CONFIRMED' },
        });
        await tx.orderStatusHistory.create({
          data: {
            orderId: createdOrder.id,
            status: 'CONFIRMED',
            note: 'Cash on Delivery order confirmed',
            createdBy: userId || null,
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return createdOrder;
    });

    res.status(201).json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
        status: order.status,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
