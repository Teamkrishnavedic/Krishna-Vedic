import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const variantSelect = {
  id: true,
  name: true,
  sku: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  lowStockThreshold: true,
  weight: true,
  weightUnit: true,
  isDefault: true,
  sortOrder: true,
};

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  shortDescription: true,
  sku: true,
  status: true,
  isFeatured: true,
  taxRate: true,
  tags: true,
  ingredients: true,
  storageInstructions: true,
  createdAt: true,
  categoryId: true,
  category: { select: { id: true, name: true, slug: true } },
  variants: { select: variantSelect, orderBy: { sortOrder: 'asc' as const } },
  images: {
    select: { id: true, url: true, altText: true, sortOrder: true },
    orderBy: { sortOrder: 'asc' as const },
  },
};

// GET /api/products
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      categoryId,
      featured,
      search,
      page = '1',
      limit = '20',
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    const take = Math.min(parseInt(limit as string, 10), 100);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = { status: 'PUBLISHED' };

    const CATEGORY_ALIASES: Record<string, string> = {
      'oil': 'cold-pressed-oils',
      'oils': 'cold-pressed-oils',
      'edible-oils': 'cold-pressed-oils',
      'wood-pressed-oils': 'cold-pressed-oils',
      'masala': 'spices-masalas',
      'masalas': 'spices-masalas',
      'masala-blends': 'spices-masalas',
      'spices': 'spices-masalas',
      'spice-powders': 'spices-masalas',
      'whole-spices': 'spices-masalas',
      'ghee-honey': 'ghee-honey-other-products',
      'ghee': 'ghee-honey-other-products',
      'honey': 'ghee-honey-other-products',
      'flour': 'flour-atta',
      'atta': 'flour-atta',
      'grains': 'whole-grains-cereals',
      'cereals': 'whole-grains-cereals',
      'oil-cakes': 'oil-cakes-khal',
      'khal': 'oil-cakes-khal',
    };

    if (categoryId) {
      where.categoryId = categoryId as string;
    } else if (category && category !== 'all') {
      const rawCat = (category as string).toLowerCase().trim();
      const targetSlug = CATEGORY_ALIASES[rawCat] || rawCat;
      const cat = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: targetSlug },
            { slug: rawCat },
            { id: category as string },
          ],
        },
      });
      if (cat) {
        where.categoryId = cat.id;
      }
    }

    if (featured === 'true') where.isFeatured = true;

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
        { tags: { contains: search as string } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'featured') {
      orderBy = { isFeatured: 'desc' };
    } else if (sort === 'name') {
      orderBy = { name: order === 'desc' ? 'desc' : 'asc' };
    } else if (sort === 'createdAt') {
      orderBy = { createdAt: order === 'asc' ? 'asc' : 'desc' };
    } else {
      orderBy = { isFeatured: 'desc' };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        select: productSelect,
        orderBy,
        take,
        skip,
      }),
    ]);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/bestsellers
// Calculates true bestsellers based on cumulative units sold across valid customer orders
router.get('/bestsellers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '4', 10), 20);

    // 1. Group all sold OrderItems across non-cancelled, non-refunded orders
    const salesByVariant = await prisma.orderItem.groupBy({
      by: ['variantId'],
      _sum: { quantity: true },
      where: {
        variantId: { not: null },
        order: {
          status: { notIn: ['CANCELLED', 'REFUNDED'] },
        },
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
    });

    // 2. Map sold quantities to product IDs
    const productSalesMap = new Map<string, number>();
    for (const item of salesByVariant) {
      if (item.variantId && item._sum.quantity) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          select: { productId: true },
        });
        if (variant?.productId) {
          const current = productSalesMap.get(variant.productId) || 0;
          productSalesMap.set(variant.productId, current + item._sum.quantity);
        }
      }
    }

    // 3. Fetch published products
    const publishedProducts = await prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      select: productSelect,
    });

    // 4. Sort strictly by actual units sold (descending).
    // If sales are 0 or tied (e.g. brand new catalog items), fallback to featured / newest.
    const sortedProducts = publishedProducts
      .map((p) => ({
        ...p,
        unitsSold: productSalesMap.get(p.id) || 0,
      }))
      .sort((a, b) => {
        if (b.unitsSold !== a.unitsSold) {
          return b.unitsSold - a.unitsSold; // Highest sales always ranks first!
        }
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });

    const bestsellers = sortedProducts.slice(0, limit);

    res.json({ products: bestsellers });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      select: productSelect,
    });

    if (!product || product.status === 'ARCHIVED') throw new AppError(404, 'Product not found');
    if (product.status === 'DRAFT') throw new AppError(404, 'Product not found');

    // ─── Amazon-Style Recommendation Algorithm ──────────────────────────
    // 1. Similar Products: same category first, fallback to featured catalogue
    const sameCategory = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        id: { not: product.id },
        ...(product.categoryId ? { categoryId: product.categoryId } : {}),
      },
      select: productSelect,
      take: 6,
      orderBy: { isFeatured: 'desc' },
    });

    let similarProducts = [...sameCategory];
    if (similarProducts.length < 4) {
      const more = await prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          id: { notIn: [product.id, ...similarProducts.map((p) => p.id)] },
        },
        select: productSelect,
        take: 6 - similarProducts.length,
        orderBy: { isFeatured: 'desc' },
      });
      similarProducts.push(...more);
    }

    // 2. Frequently Bought Together (Complementary pairing logic)
    const currentName = product.name.toLowerCase();
    const currentCategory = (product.category?.name || '').toLowerCase();

    const pairFilter: any = {
      status: 'PUBLISHED',
      id: { not: product.id },
      variants: {
        some: {
          price: { gt: 0 },
        },
      },
    };

    if (currentName.includes('oil') || currentCategory.includes('oil')) {
      // If customer is viewing cooking oil, pair with essential spice or bilona ghee
      pairFilter.OR = [
        { name: { contains: 'Turmeric' } },
        { name: { contains: 'Haldi' } },
        { name: { contains: 'Cumin' } },
        { name: { contains: 'Jeera' } },
        { name: { contains: 'Ghee' } },
      ];
    } else if (currentName.includes('turmeric') || currentName.includes('haldi')) {
      // Curcumin + Piperine (Pepper) Ayurvedic absorption synergy or traditional Mustard Oil
      pairFilter.OR = [
        { name: { contains: 'Pepper' } },
        { name: { contains: 'Kali Mirch' } },
        { name: { contains: 'Mustard' } },
        { name: { contains: 'Sarson' } },
      ];
    } else if (currentCategory.includes('spice') || currentName.includes('masala')) {
      // If viewing spice, pair with pure cold-pressed oil
      pairFilter.OR = [
        { name: { contains: 'Mustard' } },
        { name: { contains: 'Sarson' } },
        { name: { contains: 'Sesame' } },
        { name: { contains: 'Til' } },
        { name: { contains: 'Ghee' } },
      ];
    } else {
      // Fallback: Pick top featured product from a different category
      if (product.categoryId) {
        pairFilter.categoryId = { not: product.categoryId };
      }
    }

    let frequentlyBoughtTogether = await prisma.product.findFirst({
      where: pairFilter,
      select: productSelect,
      orderBy: { isFeatured: 'desc' },
    });

    if (!frequentlyBoughtTogether) {
      frequentlyBoughtTogether = similarProducts.find((p) => p.variants?.some((v) => v.price > 0)) || similarProducts[0] || null;
    }

    res.json({
      product,
      recommendations: {
        similarProducts,
        frequentlyBoughtTogether,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
