import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { registerSchema, loginSchema } from '@krishnavedic/shared';

const router = Router();

function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId.startsWith('your-google-client-id')) {
    return null;
  }
  return new OAuth2Client(clientId);
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError(409, 'An account with this email already exists');

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: 'CUSTOMER',
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    req.session.userId = user.id;
    req.session.userRole = user.role;

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.isActive) throw new AppError(401, 'Invalid email or password');

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid email or password');

    // Merge guest cart if any
    if (req.session.guestId) {
      const guestCart = await prisma.cart.findUnique({
        where: { guestId: req.session.guestId },
        include: { items: true },
      });
      if (guestCart) {
        let userCart = await prisma.cart.findUnique({ where: { userId: user.id } });
        if (!userCart) {
          userCart = await prisma.cart.create({ data: { userId: user.id } });
        }
        // Merge items
        for (const item of guestCart.items) {
          const existing = await prisma.cartItem.findUnique({
            where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
          });
          if (existing) {
            await prisma.cartItem.update({
              where: { id: existing.id },
              data: { quantity: existing.quantity + item.quantity },
            });
          } else {
            await prisma.cartItem.create({
              data: { cartId: userCart.id, variantId: item.variantId, quantity: item.quantity },
            });
          }
        }
        // Delete guest cart
        await prisma.cart.delete({ where: { id: guestCart.id } });
      }
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.guestId = undefined;

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/google
router.post('/google', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { credential } = req.body;
    if (!credential || typeof credential !== 'string') {
      throw new AppError(400, 'Google credential token is required');
    }

    const client = getGoogleOAuthClient();
    if (!client) {
      throw new AppError(503, 'Google authentication is not configured on this server');
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new AppError(400, 'Invalid Google token payload');
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = payload.name || payload.given_name || email.split('@')[0];
    const avatarUrl = payload.picture;

    // Check if user exists by googleId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email },
        ],
      },
    });

    if (user) {
      if (!user.isActive) {
        throw new AppError(403, 'Account is inactive. Please contact support.');
      }
      // Link Google ID or update avatar if newly available
      const updateData: any = {};
      if (!user.googleId) updateData.googleId = googleId;
      if (!user.avatarUrl && avatarUrl) updateData.avatarUrl = avatarUrl;

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    } else {
      // Create new customer account with verified Google identity
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          avatarUrl,
          role: 'CUSTOMER',
          isActive: true,
        },
      });
    }

    // Merge guest cart if any
    if (req.session.guestId) {
      const guestCart = await prisma.cart.findUnique({
        where: { guestId: req.session.guestId },
        include: { items: true },
      });
      if (guestCart) {
        let userCart = await prisma.cart.findUnique({ where: { userId: user.id } });
        if (!userCart) {
          userCart = await prisma.cart.create({ data: { userId: user.id } });
        }
        for (const item of guestCart.items) {
          const existing = await prisma.cartItem.findUnique({
            where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
          });
          if (existing) {
            await prisma.cartItem.update({
              where: { id: existing.id },
              data: { quantity: existing.quantity + item.quantity },
            });
          } else {
            await prisma.cartItem.create({
              data: { cartId: userCart.id, variantId: item.variantId, quantity: item.quantity },
            });
          }
        }
        await prisma.cart.delete({ where: { id: guestCart.id } });
      }
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.guestId = undefined;

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('kv.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { id: true, name: true, email: true, phone: true, role: true, avatarUrl: true, createdAt: true },
    });
    if (!user) throw new AppError(404, 'User not found');
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/auth/me
router.patch('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone } = req.body;
    const updateData: { name?: string; phone?: string } = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
        throw new AppError(422, 'Name must be between 2 and 100 characters');
      }
      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== 'string' || !/^[6-9]\d{9}$/.test(phone.trim())) {
        throw new AppError(422, 'Enter a valid 10-digit Indian mobile number');
      }
      updateData.phone = phone.trim();
    }

    const user = await prisma.user.update({
      where: { id: req.session.userId },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/change-password
router.post('/change-password', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      throw new AppError(422, 'New password must be at least 8 characters');
    }

    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    if (!user) throw new AppError(404, 'User not found');

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new AppError(401, 'Current password is incorrect');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    // Regenerate session to invalidate any potentially compromised sessions
    req.session.regenerate((err) => {
      if (!err) {
        req.session.userId = user.id;
        req.session.userRole = user.role;
      }
      res.json({ message: 'Password changed successfully' });
    });
  } catch (err) {
    next(err);
  }
});

export default router;
