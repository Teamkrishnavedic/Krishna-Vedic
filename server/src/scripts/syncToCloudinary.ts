import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../lib/prisma';

function configureCloudinary() {
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
    });
    return true;
  } else if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return true;
  }
  return false;
}

async function main() {
  console.log('🔄 Checking Cloudinary credentials...');
  const isConfigured = configureCloudinary();
  if (!isConfigured) {
    console.error('❌ Cloudinary credentials are not configured in server/.env');
    process.exit(1);
  }

  try {
    const ping = await cloudinary.api.ping();
    console.log('✅ Cloudinary ping success:', ping);
  } catch (err: any) {
    console.error('❌ Cloudinary connection failed:', err.message || err);
    console.error('Tip: If you see "cloud_name mismatch", check that your CLOUDINARY_CLOUD_NAME in .env matches the Cloud Name in your Cloudinary Dashboard.');
    process.exit(1);
  }

  const images = await prisma.productImage.findMany({
    include: { product: true },
  });

  console.log(`Found ${images.length} product images in database.`);

  let synced = 0;
  for (const img of images) {
    if (img.url.includes('res.cloudinary.com')) {
      console.log(`✓ Already on Cloudinary: ${img.product?.name}`);
      continue;
    }

    try {
      console.log(`Uploading ${img.url.substring(0, 50)}... for ${img.product?.name}`);
      const uploadRes = await cloudinary.uploader.upload(img.url, {
        folder: 'krishnavedic/products',
        resource_type: 'image',
      });

      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: uploadRes.secure_url },
      });

      console.log(`✅ Uploaded to: ${uploadRes.secure_url}`);
      synced++;
    } catch (err: any) {
      console.error(`Failed to upload ${img.id}:`, err.message || err);
    }
  }

  console.log(`🎉 Sync complete! ${synced} images transferred to Cloudinary.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
