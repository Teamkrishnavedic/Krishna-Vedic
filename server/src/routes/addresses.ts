import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { requireAuth } from '../middleware/auth';
import { getRouteParam } from '../lib/route-params';
import { addressSchema } from '@krishnavedic/shared';

const router = Router();

// GET /api/addresses
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.session.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ addresses });
  } catch (err) {
    next(err);
  }
});

// POST /api/addresses
router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = addressSchema.parse(req.body);

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.session.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: { ...data, userId: req.session.userId! },
    });
    res.status(201).json({ address });
  } catch (err) {
    next(err);
  }
});

// PUT /api/addresses/:id
router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'addressId');
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.session.userId) throw new AppError(404, 'Address not found');

    const data = addressSchema.parse(req.body);
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.session.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data,
    });
    res.json({ address });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/addresses/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'addressId');
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.session.userId) throw new AppError(404, 'Address not found');

    await prisma.address.delete({ where: { id } });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/addresses/:id/set-default
router.patch('/:id/set-default', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'addressId');
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.session.userId) throw new AppError(404, 'Address not found');

    await prisma.address.updateMany({
      where: { userId: req.session.userId },
      data: { isDefault: false },
    });
    const address = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
    res.json({ address });
  } catch (err) {
    next(err);
  }
});

export default router;
