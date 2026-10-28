import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { addToCartSchema, updateCartItemSchema } from '@krishnavedic/shared';
import { nanoid } from 'nanoid';

const router = Router();

async function getOrCreateCart(req: Request) {
  const userId = req.session.userId;
  const guestId = req.session.guestId;

  if (userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true, slug: true, images: { take: 1 } } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: { select: { name: true, slug: true, images: { take: 1 } } },
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }
    return cart;
  }

  // Guest cart
  let gId = guestId;
  if (!gId) {
    gId = nanoid();
    req.session.guestId = gId;
  }

  let cart = await prisma.cart.findUnique({
    where: { guestId: gId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { select: { name: true, slug: true, images: { take: 1 } } },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { guestId: gId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true, slug: true, images: { take: 1 } } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }
  return cart;
}

function cartSummary(cart: any) {
  const items = cart.items.map((item: any) => ({
    id: item.id,
    variantId: item.variantId,
    quantity: item.quantity,
    price: item.variant.price,
    compareAtPrice: item.variant.compareAtPrice,
    stock: item.variant.stock,
    variantName: item.variant.name,
    sku: item.variant.sku,
    productName: item.variant.product.name,
    productSlug: item.variant.product.slug,
    imageUrl: item.variant.product.images?.[0]?.url || null,
    subtotal: item.variant.price * item.quantity,
  }));

  const subtotal = items.reduce((sum: number, i: any) => sum + i.subtotal, 0);

  return { id: cart.id, items, subtotal };
}

// GET /api/cart
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await getOrCreateCart(req);
    res.json(cartSummary(cart));
  } catch (err) {
    next(err);
  }
});

// POST /api/cart/items
router.post('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { variantId, quantity } = addToCartSchema.parse(req.body);

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { select: { status: true } } },
    });
    if (!variant || variant.product.status !== 'PUBLISHED') {
      throw new AppError(404, 'Product not found');
    }
    if (variant.stock < quantity) {
      throw new AppError(409, `Only ${variant.stock} units available`);
    }

    const cart = await getOrCreateCart(req);

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
    });

    const newQuantity = existing ? existing.quantity + quantity : quantity;
    if (newQuantity > variant.stock) {
      throw new AppError(409, `Only ${variant.stock} units available`);
    }

    if (existing) {
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQuantity } });
    } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, variantId, quantity } });
    }

    const updatedCart = await getOrCreateCart(req);
    res.json(cartSummary(updatedCart));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/cart/items/:itemId
router.patch('/items/:itemId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity } = updateCartItemSchema.parse(req.body);
    const cart = await getOrCreateCart(req);

    const item = cart.items.find((i: any) => i.id === req.params.itemId);
    if (!item) throw new AppError(404, 'Cart item not found');

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
      if (!variant || variant.stock < quantity) {
        throw new AppError(409, `Only ${variant?.stock || 0} units available`);
      }
      await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    }

    const updatedCart = await getOrCreateCart(req);
    res.json(cartSummary(updatedCart));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/items/:itemId
router.delete('/items/:itemId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await getOrCreateCart(req);
    const item = cart.items.find((i: any) => i.id === req.params.itemId);
    if (!item) throw new AppError(404, 'Cart item not found');

    await prisma.cartItem.delete({ where: { id: item.id } });
    const updatedCart = await getOrCreateCart(req);
    res.json(cartSummary(updatedCart));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart (clear cart)
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await getOrCreateCart(req);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
});

export default router;
