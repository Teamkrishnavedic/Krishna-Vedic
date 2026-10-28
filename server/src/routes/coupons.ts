import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/coupons/validate?code=XXX
router.get('/validate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'Coupon code is required' });

    const coupon = await prisma.coupon.findUnique({
      where: { code: (code as string).toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ error: 'Coupon not found or inactive' });
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      return res.status(400).json({ error: 'Coupon is not yet active' });
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    res.json({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
