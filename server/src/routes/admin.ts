import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { getRouteParam } from '../lib/route-params';
import { requireAdmin, requireStaff, requireSuperAdmin } from '../middleware/auth';
import {
  productSchema,
  variantSchema,
  categorySchema,
  priceUpdateSchema,
  couponSchema,
  shippingRuleSchema,
  inventoryAdjustmentSchema,
  orderStatusUpdateSchema,
} from '@krishnavedic/shared';

const router = Router();

// Configure Cloudinary for admin operations
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Extracts the Cloudinary public_id from a URL like:
 * https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder/subfolder/sample.jpg
 * Returns: 'folder/subfolder/sample'
 */
function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  if (match && match[1]) {
    const parts = match[1].split('/');
    const clean = parts.filter(
      (p) => !p.includes(',') && !p.startsWith('c_') && !p.startsWith('w_') && !p.startsWith('h_')
    );
    return clean.join('/');
  }
  return null;
}

/**
 * Deletes asset directly from Cloudinary or local disk storage
 */
async function deleteAssetFromStorage(url: string) {
  try {
    if (url.includes('cloudinary.com')) {
      const publicId = extractCloudinaryPublicId(url);
      if (publicId) {
        console.log(`🗑️ Deleting from Cloudinary: ${publicId}`);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary destroy result:`, result);
        return result;
      }
    } else if (url.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), url);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
        console.log(`🗑️ Deleted local file: ${localPath}`);
      }
    }
  } catch (err: any) {
    console.warn(`Could not delete asset from storage (${url}):`, err.message || err);
  }
}

// All admin routes require at least staff role
router.use(requireStaff);

// ─── Dashboard ────────────────────────────────────────────────────────────────

router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      totalCustomers,
      lowStockVariants,
      todayRevenue,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.productVariant.findMany({
        where: { stock: { lte: prisma.productVariant.fields.lowStockThreshold } },
        include: { product: { select: { name: true } } },
        take: 10,
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: today, lt: tomorrow },
          paymentStatus: 'PAID',
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          paymentMethod: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    // Low stock requires raw query since Prisma doesn't support field comparisons
    const lowStock = await prisma.$queryRaw`
      SELECT pv.id, pv.name as variantName, pv.sku, pv.stock, pv."lowStockThreshold",
             p.name as productName, p.id as productId
      FROM "ProductVariant" pv
      JOIN "Product" p ON p.id = pv."productId"
      WHERE pv.stock <= pv."lowStockThreshold"
      LIMIT 10
    `;

    res.json({
      stats: {
        totalOrders,
        todayOrders,
        pendingOrders,
        totalCustomers,
        todayRevenue: todayRevenue._sum.total || 0,
        totalRevenue: totalRevenue._sum.total || 0,
      },
      lowStock,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
});

// ─── Categories ──────────────────────────────────────────────────────────────

router.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

router.post('/categories', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await prisma.category.create({ data });
    await auditLog(req, 'CREATE_CATEGORY', 'Category', category.id, null, category);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
});

router.put('/categories/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'categoryId');
    const data = categorySchema.parse(req.body);
    const old = await prisma.category.findUnique({ where: { id } });
    const category = await prisma.category.update({ where: { id }, data });
    await auditLog(req, 'UPDATE_CATEGORY', 'Category', category.id, old, category);
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

router.delete('/categories/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = getRouteParam(req.params.id, 'categoryId');
    const { reassignTo } = req.query;

    const count = await prisma.product.count({ where: { categoryId } });
    if (count > 0) {
      if (!reassignTo || typeof reassignTo !== 'string') {
        throw new AppError(
          409,
          `Cannot delete category because it contains ${count} product${count > 1 ? 's' : ''}. Please select a replacement category to move these products to.`
        );
      }

      const targetCat = await prisma.category.findUnique({ where: { id: reassignTo } });
      if (!targetCat) {
        throw new AppError(400, 'Selected replacement category does not exist.');
      }
      if (targetCat.id === categoryId) {
        throw new AppError(400, 'Cannot reassign products to the same category being deleted.');
      }

      // Reassign all products in this category to target category
      await prisma.product.updateMany({
        where: { categoryId },
        data: { categoryId: targetCat.id },
      });
    }

    // Detach any child subcategories so parentId foreign key doesn't fail
    await prisma.category.updateMany({
      where: { parentId: categoryId },
      data: { parentId: null },
    });

    await prisma.category.delete({ where: { id: categoryId } });
    await auditLog(req, 'DELETE_CATEGORY', 'Category', String(categoryId), null, null);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ─── Products ────────────────────────────────────────────────────────────────

router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status, category, search } = req.query;
    const take = Math.min(parseInt(limit as string, 10), 100);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = { slug: category };
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { sku: { contains: search as string } },
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: { orderBy: { sortOrder: 'asc' } },
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          _count: { select: { variants: true } },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
    ]);

    res.json({ products, pagination: { total, page: parseInt(page as string, 10), limit: take } });
  } catch (err) {
    next(err);
  }
});

router.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'productId');
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: { include: { priceHistory: { take: 5, orderBy: { createdAt: 'desc' } } }, orderBy: { sortOrder: 'asc' } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product) throw new AppError(404, 'Product not found');
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

router.post('/products', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({
      data: {
        ...data,
        tags: JSON.stringify(data.tags),
      },
    });
    await auditLog(req, 'CREATE_PRODUCT', 'Product', product.id, null, product);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});

router.put('/products/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'productId');
    const data = productSchema.parse(req.body);
    const old = await prisma.product.findUnique({ where: { id } });
    const product = await prisma.product.update({
      where: { id },
      data: { ...data, tags: JSON.stringify(data.tags) },
    });
    await auditLog(req, 'UPDATE_PRODUCT', 'Product', product.id, old, product);
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

router.patch('/products/:id/status', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      throw new AppError(422, 'Invalid status');
    }
    const id = getRouteParam(req.params.id, 'productId');
    const product = await prisma.product.update({
      where: { id },
      data: { status },
    });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// ─── Product Images ───────────────────────────────────────────────────────────

router.post('/products/:id/images', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, altText, sortOrder } = req.body;
    if (!url) throw new AppError(400, 'Image URL is required');
    const image = await prisma.productImage.create({
      data: { productId: getRouteParam(req.params.id, 'productId'), url, altText, sortOrder: sortOrder || 0 },
    });
    res.status(201).json({ image });
  } catch (err) {
    next(err);
  }
});

router.delete('/products/:productId/images/:imageId', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageId = getRouteParam(req.params.imageId, 'imageId');
    const img = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (img?.url) {
      // Delete asset from Cloudinary or local disk
      await deleteAssetFromStorage(img.url);
    }

    await prisma.productImage.delete({ where: { id: imageId } });
    res.json({ message: 'Image deleted from Cloudinary and database' });
  } catch (err) {
    next(err);
  }
});

router.delete('/products/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'productId');
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    });
    if (!product) throw new AppError(404, 'Product not found');

    // Clean up all images from Cloudinary / storage
    for (const img of product.images) {
      if (img.url) {
        await deleteAssetFromStorage(img.url);
      }
    }

    // Safely disassociate variant foreign key references before deleting product
    const variantIds = product.variants.map((v) => v.id);
    if (variantIds.length > 0) {
      await prisma.orderItem.updateMany({
        where: { variantId: { in: variantIds } },
        data: { variantId: null },
      });
      await prisma.cartItem.deleteMany({
        where: { variantId: { in: variantIds } },
      });
      await prisma.priceHistory.deleteMany({
        where: { variantId: { in: variantIds } },
      });
      await prisma.inventoryMovement.deleteMany({
        where: { variantId: { in: variantIds } },
      });
    }

    await prisma.product.delete({ where: { id } });
    await auditLog(req, 'DELETE_PRODUCT', 'Product', id, product, null);
    res.json({ message: 'Product and all associated images deleted' });
  } catch (err) {
    next(err);
  }
});

// ─── Variants ────────────────────────────────────────────────────────────────

router.post('/variants', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = variantSchema.parse(req.body);
    const variant = await prisma.productVariant.create({ data });
    await auditLog(req, 'CREATE_VARIANT', 'ProductVariant', variant.id, null, variant);
    res.status(201).json({ variant });
  } catch (err) {
    next(err);
  }
});

router.put('/variants/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'variantId');
    const data = variantSchema.parse(req.body);
    const old = await prisma.productVariant.findUnique({ where: { id } });
    if (!old) throw new AppError(404, 'Variant not found');

    const variant = await prisma.$transaction(async (tx) => {
      // Record price history if price changed
      if (old.price !== data.price || old.compareAtPrice !== data.compareAtPrice) {
        await tx.priceHistory.create({
          data: {
            variantId: old.id,
            oldPrice: old.price,
            newPrice: data.price,
            oldCompareAt: old.compareAtPrice,
            newCompareAt: data.compareAtPrice,
            changedById: req.session.userId!,
          },
        });
      }
      return tx.productVariant.update({ where: { id }, data });
    });

    await auditLog(req, 'UPDATE_VARIANT', 'ProductVariant', variant.id, old, variant);
    res.json({ variant });
  } catch (err) {
    next(err);
  }
});

router.delete('/variants/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variantId = getRouteParam(req.params.id, 'variantId');
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new AppError(404, 'Variant not found');

    // Check if variant is in any active orders
    const activeOrders = await prisma.orderItem.count({
      where: {
        variantId,
        order: { status: { notIn: ['DELIVERED', 'CANCELLED', 'RETURNED'] } },
      },
    });
    if (activeOrders > 0) throw new AppError(409, `Cannot delete variant with ${activeOrders} active orders`);

    // Safely disassociate variant foreign key references
    await prisma.orderItem.updateMany({
      where: { variantId },
      data: { variantId: null },
    });
    await prisma.cartItem.deleteMany({
      where: { variantId },
    });
    await prisma.priceHistory.deleteMany({
      where: { variantId },
    });
    await prisma.inventoryMovement.deleteMany({
      where: { variantId },
    });

    await prisma.productVariant.delete({ where: { id: variantId } });
    await auditLog(req, 'DELETE_VARIANT', 'ProductVariant', String(variantId), variant, null);
    res.json({ message: 'Variant deleted' });
  } catch (err) {
    next(err);
  }
});

// ─── Price Management ─────────────────────────────────────────────────────────

router.patch('/variants/:id/price', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'variantId');
    const data = priceUpdateSchema.parse(req.body);
    const old = await prisma.productVariant.findUnique({ where: { id } });
    if (!old) throw new AppError(404, 'Variant not found');

    const variant = await prisma.$transaction(async (tx) => {
      await tx.priceHistory.create({
        data: {
          variantId: old.id,
          oldPrice: old.price,
          newPrice: data.price,
          oldCompareAt: old.compareAtPrice,
          newCompareAt: data.compareAtPrice,
          reason: data.reason,
          changedById: req.session.userId!,
        },
      });
      return tx.productVariant.update({
        where: { id },
        data: { price: data.price, compareAtPrice: data.compareAtPrice },
      });
    });

    await auditLog(req, 'UPDATE_PRICE', 'ProductVariant', variant.id, { price: old.price }, { price: data.price });
    res.json({ variant });
  } catch (err) {
    next(err);
  }
});

router.get('/variants/:id/price-history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variantId = getRouteParam(req.params.id, 'variantId');
    const history = await prisma.priceHistory.findMany({
      where: { variantId },
      include: { changedBy: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ history });
  } catch (err) {
    next(err);
  }
});

// ─── Inventory ────────────────────────────────────────────────────────────────

router.post('/inventory/adjust', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = inventoryAdjustmentSchema.parse(req.body);
    const variant = await prisma.productVariant.findUnique({ where: { id: data.variantId } });
    if (!variant) throw new AppError(404, 'Variant not found');

    const newStock = variant.stock + data.quantity;
    if (newStock < 0) throw new AppError(400, 'Stock cannot go below 0');

    await prisma.$transaction([
      prisma.productVariant.update({
        where: { id: data.variantId },
        data: { stock: newStock },
      }),
      prisma.inventoryMovement.create({
        data: {
          variantId: data.variantId,
          quantity: data.quantity,
          type: data.type,
          reason: data.reason,
        },
      }),
    ]);

    await auditLog(req, 'INVENTORY_ADJUST', 'ProductVariant', data.variantId, { stock: variant.stock }, { stock: newStock });
    res.json({ newStock });
  } catch (err) {
    next(err);
  }
});

router.get('/inventory/movements', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { variantId, page = '1', limit = '20' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const movements = await prisma.inventoryMovement.findMany({
      where: variantId ? { variantId: variantId as string } : {},
      include: {
        variant: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
    res.json({ movements });
  } catch (err) {
    next(err);
  }
});

// ─── Orders ───────────────────────────────────────────────────────────────────

router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status, search } = req.query;
    const take = Math.min(parseInt(limit as string, 10), 100);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string } },
        { shippingName: { contains: search as string } },
        { shippingPhone: { contains: search as string } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: { select: { productName: true, quantity: true, priceSnapshot: true } },
          payment: { select: { status: true, gatewayPaymentId: true } },
        },
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

router.get('/orders/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'orderId');
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: true,
        payment: { include: { events: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        inventoryMovements: { include: { variant: { select: { name: true } } } },
      },
    });
    if (!order) throw new AppError(404, 'Order not found');
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

router.patch('/orders/:id/status', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'orderId');
    const { status, note } = orderStatusUpdateSchema.parse(req.body);
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new AppError(404, 'Order not found');

    await prisma.$transaction([
      prisma.order.update({ where: { id: order.id }, data: { status } }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status,
          note: note || null,
          createdBy: req.session.userId,
        },
      }),
    ]);

    // Release stock on cancellation
    if (status === 'CANCELLED') {
      const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
      for (const item of items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
          await prisma.inventoryMovement.create({
            data: {
              variantId: item.variantId,
              quantity: item.quantity,
              type: 'RETURN',
              reason: `Order ${order.orderNumber} cancelled`,
              orderId: order.id,
            },
          });
        }
      }
    }

    await auditLog(req, 'UPDATE_ORDER_STATUS', 'Order', order.id, { status: order.status }, { status });
    res.json({ message: 'Order status updated' });
  } catch (err) {
    next(err);
  }
});

// ─── Customers ────────────────────────────────────────────────────────────────

router.get('/customers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const where: any = { role: 'CUSTOMER' };
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
        { phone: { contains: search as string } },
      ];
    }

    const [total, customers] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
    ]);

    res.json({ customers, pagination: { total, page: parseInt(page as string, 10), limit: take } });
  } catch (err) {
    next(err);
  }
});

router.patch('/customers/:id/toggle-active', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'customerId');
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(404, 'Customer not found');
    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });
    res.json({ isActive: updated.isActive });
  } catch (err) {
    next(err);
  }
});

// ─── Coupons ─────────────────────────────────────────────────────────────────

router.get('/coupons', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { redemptions: true } } },
    });
    res.json({ coupons });
  } catch (err) {
    next(err);
  }
});

router.post('/coupons', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = couponSchema.parse(req.body);
    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    res.status(201).json({ coupon });
  } catch (err) {
    next(err);
  }
});

router.put('/coupons/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'couponId');
    const data = couponSchema.parse(req.body);
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        code: data.code.toUpperCase(),
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    res.json({ coupon });
  } catch (err) {
    next(err);
  }
});

router.delete('/coupons/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const couponId = getRouteParam(req.params.id, 'couponId');
    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!coupon) throw new AppError(404, 'Coupon not found');

    // Disassociate orders from this coupon
    await prisma.order.updateMany({
      where: { couponId },
      data: { couponId: null },
    });
    // Remove redemptions
    await prisma.couponRedemption.deleteMany({
      where: { couponId },
    });

    await prisma.coupon.delete({ where: { id: couponId } });
    await auditLog(req, 'DELETE_COUPON', 'Coupon', String(couponId), coupon, null);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ─── Shipping Rules ────────────────────────────────────────────────────────────

router.get('/shipping-rules', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await prisma.shippingRule.findMany({ orderBy: { minOrderValue: 'asc' } });
    res.json({ rules });
  } catch (err) {
    next(err);
  }
});

router.post('/shipping-rules', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = shippingRuleSchema.parse(req.body);
    const rule = await prisma.shippingRule.create({ data });
    res.status(201).json({ rule });
  } catch (err) {
    next(err);
  }
});

router.put('/shipping-rules/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'ruleId');
    const data = shippingRuleSchema.parse(req.body);
    const rule = await prisma.shippingRule.update({ where: { id }, data });
    res.json({ rule });
  } catch (err) {
    next(err);
  }
});

router.delete('/shipping-rules/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getRouteParam(req.params.id, 'ruleId');
    await prisma.shippingRule.delete({ where: { id } });
    res.json({ message: 'Shipping rule deleted' });
  } catch (err) {
    next(err);
  }
});

// ─── Store Settings ───────────────────────────────────────────────────────────

router.get('/settings', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.storeSetting.findMany();
    res.json({ settings: Object.fromEntries(settings.map((s) => [s.key, s.value])) });
  } catch (err) {
    next(err);
  }
});

router.put('/settings', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { settings } = req.body as { settings: Record<string, string> };
    await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        prisma.storeSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
    res.json({ message: 'Settings updated' });
  } catch (err) {
    next(err);
  }
});

// ─── Reports ─────────────────────────────────────────────────────────────────

router.get('/reports/sales', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to as string) : new Date();

    const [revenue, orderCount, topProducts] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          paymentStatus: 'PAID',
        },
        _sum: { total: true },
        _count: true,
      }),
      prisma.order.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate, lte: endDate } },
        _count: true,
      }),
      prisma.orderItem.groupBy({
        by: ['productName'],
        where: { order: { createdAt: { gte: startDate, lte: endDate }, paymentStatus: 'PAID' } },
        _sum: { quantity: true, subtotal: true },
        orderBy: { _sum: { subtotal: 'desc' } },
        take: 10,
      }),
    ]);

    res.json({
      revenue: revenue._sum.total || 0,
      orderCount: revenue._count,
      ordersByStatus: orderCount,
      topProducts,
      period: { from: startDate, to: endDate },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Audit Logs ───────────────────────────────────────────────────────────────

router.get('/audit-logs', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50' } = req.query;
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
    res.json({ logs });
  } catch (err) {
    next(err);
  }
});

// ─── Admin User Management ───────────────────────────────────────────────────

router.get('/staff', requireSuperAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: { in: ['STAFF', 'ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ staff });
  } catch (err) {
    next(err);
  }
});

router.patch('/staff/:id/role', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    if (!['STAFF', 'ADMIN'].includes(role)) throw new AppError(422, 'Invalid role');
    const id = getRouteParam(req.params.id, 'staffId');
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// ─── Helper ───────────────────────────────────────────────────────────────────

async function auditLog(
  req: Request,
  action: string,
  entityType: string,
  entityId: string,
  oldData: any,
  newData: any,
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.session.userId,
        action,
        entityType,
        entityId,
        oldData: oldData ? JSON.stringify(oldData) : null,
        newData: newData ? JSON.stringify(newData) : null,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });
  } catch {
    // Audit failures should not break the main operation
  }
}

export default router;
