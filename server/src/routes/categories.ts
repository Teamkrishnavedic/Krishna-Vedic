import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { getRouteParam } from '../lib/route-params';

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

const CATEGORY_ALIASES: Record<string, string> = {
  'oil': 'cold-pressed-oils',
  'oils': 'cold-pressed-oils',
  'edible-oils': 'cold-pressed-oils',
  'masala': 'spices-masalas',
  'masalas': 'spices-masalas',
  'masala-blends': 'spices-masalas',
  'spices': 'spices-masalas',
  'ghee-honey': 'ghee-honey-other-products',
  'flour': 'flour-atta',
  'atta': 'flour-atta',
  'grains': 'whole-grains-cereals',
  'oil-cakes': 'oil-cakes-khal',
};

// GET /api/categories/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slugParam = getRouteParam(req.params.slug, 'slug');
    const raw = slugParam.toLowerCase().trim();
    const targetSlug = CATEGORY_ALIASES[raw] || raw;

    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: targetSlug },
          { slug: raw },
          { id: slugParam },
        ],
      },
      select: categorySelect,
    });
    if (!category) throw new AppError(404, 'Category not found');
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

export default router;
