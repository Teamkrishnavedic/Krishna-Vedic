import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/settings/store
router.get('/store', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.storeSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    const storePhone = map.support_phone || process.env.STORE_PHONE || '+91 7976123348';
    const cleanWhatsappDigits = (map.whatsapp_number || storePhone).replace(/\D/g, '');

    res.json({
      settings: {
        store_name: map.store_name || process.env.STORE_NAME || 'Krishnavedic',
        support_email: map.support_email || process.env.STORE_EMAIL || 'krishnavedic001@gmail.com',
        support_phone: storePhone,
        whatsapp_number: map.whatsapp_number || storePhone,
        whatsapp_digits: cleanWhatsappDigits,
        mill_address: map.mill_address || process.env.STORE_ADDRESS || 'Vedic Heritage Complex, Industrial Area Phase II, Jaipur, Rajasthan - 302022, India',
        announcement_text: map.announcement_text || 'अब खाएंगे दादी-दादी के ज़माने का तेल और मसाले',
        free_shipping_threshold: map.free_shipping_threshold || '799',
        ...map,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
