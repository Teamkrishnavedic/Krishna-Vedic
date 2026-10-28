import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/settings/store
router.get('/store', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.storeSetting.findMany();
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    res.json({ settings: settingsMap });
  } catch (err) {
    next(err);
  }
});

export default router;
