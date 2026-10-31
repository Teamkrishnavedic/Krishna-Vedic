import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { nanoid } from 'nanoid';

import fs from 'fs';

const router = Router();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function getCloudinaryConfig() {
  const isUrl = Boolean(process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith('cloudinary://'));
  const isExplicit = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (isUrl) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
    });
    return { configured: true, cloudName: cloudinary.config().cloud_name };
  } else if (isExplicit) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return { configured: true, cloudName: process.env.CLOUDINARY_CLOUD_NAME };
  }
  return { configured: false, cloudName: null };
}

const isProduction = process.env.NODE_ENV === 'production';

// Ensure local upload dir exists in development only (serverless filesystems in production are read-only)
const uploadsDir = path.join(process.cwd(), 'uploads', 'products');
if (!isProduction && !fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (err: any) {
    console.warn('Unable to create local uploads directory:', err.message);
  }
}

// Multer memory storage allows us to attempt Cloudinary first, falling back to disk if needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(422, 'Only JPEG, PNG, WebP, and AVIF images are allowed') as any);
    }
  },
});

// GET /api/upload/status - Diagnostic check for Cloudinary connectivity
router.get('/status', requireAdmin, async (_req: Request, res: Response) => {
  const cfg = getCloudinaryConfig();
  if (!cfg.configured) {
    return res.json({
      connected: false,
      configured: false,
      message: 'Cloudinary environment variables not detected or incomplete.',
      cloudName: null,
    });
  }

  try {
    const pingRes = await cloudinary.api.ping();
    return res.json({
      connected: true,
      configured: true,
      message: 'Cloudinary connected and authenticated successfully.',
      cloudName: cfg.cloudName,
      details: pingRes,
    });
  } catch (err: any) {
    return res.json({
      connected: false,
      configured: true,
      message: err.message || 'Authentication error with Cloudinary',
      cloudName: cfg.cloudName,
      tip: err.message?.includes('cloud_name mismatch')
        ? 'Your CLOUDINARY_CLOUD_NAME in .env does not match the API Key. Check the Cloud Name in your Cloudinary Dashboard (e.g. at https://cloudinary.com/console).'
        : undefined,
    });
  }
});

// POST /api/upload/product-image - Handles file upload (tries Cloudinary, falls back to disk)
router.post(
  '/product-image',
  requireAdmin,
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new AppError(400, 'No file uploaded');

      const cfg = getCloudinaryConfig();

      if (isProduction && !cfg.configured) {
        throw new AppError(
          500,
          'Cloudinary is not configured. Cloud-based image storage is required for production serverless deployments.',
        );
      }

      // If Cloudinary is configured, attempt upload
      if (cfg.configured && req.file.buffer) {
        try {
          const uploadResult = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'krishnavedic/products',
                resource_type: 'image',
                format: 'webp',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(req.file?.buffer);
          });

          return res.json({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            provider: 'cloudinary',
            message: 'Image uploaded to Cloudinary successfully',
          });
        } catch (cloudErr: any) {
          if (isProduction) {
            throw new AppError(
              500,
              `Cloudinary upload failed: ${cloudErr.message || 'Image processing error'}`,
            );
          }
          console.warn('Cloudinary upload error, falling back to local disk storage:', cloudErr.message || cloudErr);
          // Fall through to save locally in development only
        }
      }

      // Local storage fallback with strict extension whitelist
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
      const rawExt = path.extname(req.file.originalname).toLowerCase();
      const ext = allowedExts.includes(rawExt) ? rawExt : '.webp';
      const filename = `${nanoid()}-${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, req.file.buffer);

      const url = `/uploads/products/${filename}`;
      return res.json({
        url,
        filename,
        provider: 'local',
        message: cfg.configured
          ? 'Cloudinary credentials error; saved to server local storage fallback.'
          : 'Saved to local server storage.',
      });
    } catch (err) {
      next(err);
    }
  },
);

// SSRF Protection: verifies an external image URL is a public web host and not a private/internal IP
function isSafeExternalImageUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

    const hostname = parsed.hostname.toLowerCase();
    // Block loopback, localhost, and cloud metadata services
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      hostname === '169.254.169.254' ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// POST /api/upload/push-url-to-cloudinary - Fetches an external image URL and pushes it to Cloudinary
router.post(
  '/push-url-to-cloudinary',
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageUrl } = req.body;
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new AppError(400, 'imageUrl is required');
      }

      // Validate against SSRF attempts
      if (!isSafeExternalImageUrl(imageUrl)) {
        throw new AppError(400, 'Invalid or prohibited image URL (internal/private IP addresses are blocked)');
      }

      const cfg = getCloudinaryConfig();
      if (!cfg.configured) {
        throw new AppError(400, 'Cloudinary is not configured on this server');
      }

      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: 'krishnavedic/products',
        resource_type: 'image',
      });

      return res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        provider: 'cloudinary',
      });
    } catch (err: any) {
      next(new AppError(500, `Cloudinary upload failed: ${err.message || 'Unknown error'}`));
    }
  },
);

export default router;
