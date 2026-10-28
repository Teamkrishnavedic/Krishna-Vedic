import rateLimit from 'express-rate-limit';

export const rateLimiters = {
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  checkout: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30,
    message: { error: 'Too many checkout requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  general: rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    message: { error: 'Too many requests. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  upload: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: { error: 'Too many upload attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  }),
};
