import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  parentId: true,
  sortOrder: true,
  children: {
    select: { id: true, name: true, slug: true, imageUrl: true, sortOrder: true },
    orderBy: { sortOrder: 'asc' as const },
  },
  _count: { select: { products: true } },
};

// GET /api/categories
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      select: categorySelect,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      select: categorySelect,
    });
    if (!category) throw new AppError(404, 'Category not found');
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

export default router;
