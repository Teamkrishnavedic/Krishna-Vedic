import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';
import { getRouteParam } from '../lib/route-params';
import checkoutRoutes from './checkout';

const router = Router();

// POST /api/orders (alias to /api/checkout/place-order)
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  req.url = '/place-order';
  checkoutRoutes(req, res, next);
});

const orderSelect = {
  id: true,
  orderNumber: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  subtotal: true,
  discountAmount: true,
  shippingCharge: true,
  total: true,
  shippingName: true,
  shippingPhone: true,
  shippingLine1: true,
  shippingLine2: true,
  shippingCity: true,
  shippingState: true,
  shippingPincode: true,
  deliveryInstructions: true,
  couponCode: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      productName: true,
      variantName: true,
      sku: true,
      priceSnapshot: true,
      quantity: true,
      subtotal: true,
    },
  },
  payment: {
    select: {
      id: true,
      gateway: true,
      gatewayOrderId: true,
      gatewayPaymentId: true,
      status: true,
      amount: true,
    },
  },
  statusHistory: {
    select: { status: true, note: true, createdAt: true },
    orderBy: { createdAt: 'desc' as const },
  },
};

// GET /api/orders (customer's own orders)
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const [total, orders] = await Promise.all([
      prisma.order.count({ where: { userId: req.session.userId } }),
      prisma.order.findMany({
        where: { userId: req.session.userId },
        select: orderSelect,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
    ]);

    res.json({ orders, pagination: { total, page: parseInt(page as string, 10), limit: take } });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:orderNumber (supports either orderNumber or id)
router.get('/:orderNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const identifier = getRouteParam(req.params.orderNumber, 'orderNumber');
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: identifier },
          { id: identifier },
        ],
      },
      select: {
        ...orderSelect,
        userId: true,
      },
    });

    if (!order) throw new AppError(404, 'Order not found');

    // Strict ownership verification:
    // If order is tied to a user account, require the session to belong to that user or staff/admin
    if (order.userId) {
      const isOwner = req.session.userId === order.userId;
      const isStaffOrAdmin = ['STAFF', 'ADMIN', 'SUPER_ADMIN'].includes(req.session.userRole || '');
      if (!isOwner && !isStaffOrAdmin) {
        throw new AppError(404, 'Order not found');
      }
    }

    // Strip internal userId before responding
    const { userId: _, ...safeOrder } = order;
    res.json({ order: safeOrder });
  } catch (err) {
    next(err);
  }
});

export default router;
