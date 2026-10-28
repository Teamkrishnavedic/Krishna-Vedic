/**
 * Production-ready catalogue seed data for Krishnavedic Oil & Masalas.
 * 25 Authentic Indian Cold-Pressed Oils, Stone-Ground Masalas, and Whole Spices.
 * Run: npm run db:seed --workspace=server
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database on Aiven PostgreSQL...');

  // ─── Store Settings ────────────────────────────────────────────────────────
  const settingsData = [
    { key: 'store_name', value: process.env.STORE_NAME || 'Krishnavedic Oil & Masalas' },
    { key: 'store_tagline', value: 'Ancestral Wood-Pressed Oils & Stone-Ground Masalas' },
    { key: 'store_email', value: process.env.STORE_EMAIL || 'krishnavedic001@gmail.com' },
    { key: 'store_phone', value: process.env.STORE_PHONE || '+91 7976123348' },
    { key: 'store_address', value: process.env.STORE_ADDRESS || 'Vedic Heritage Complex, Industrial Area Phase II, Jaipur, Rajasthan - 302022, India' },
    { key: 'store_currency', value: 'INR' },
    { key: 'store_currency_symbol', value: '₹' },
    { key: 'announcement_text', value: 'Complimentary Pan-India shipping on orders above ₹499 • 100% Mara Chekku & Stone Pounded' },
    { key: 'announcement_active', value: 'true' },
    { key: 'free_shipping_threshold', value: '500' },
    { key: 'cod_available', value: 'true' },
    { key: 'cod_message', value: 'Cash on Delivery available across all postal pincodes in Bharat' },
  ];

  for (const s of settingsData) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('  ✓ Store settings');

  // ─── Shipping Rules ────────────────────────────────────────────────────────
  await prisma.shippingRule.deleteMany();
  await prisma.shippingRule.createMany({
    data: [
      { name: 'Standard Pan-India Delivery', minOrderValue: 0, maxOrderValue: 49900, charge: 4900, estimatedDays: '3-5 Business Days', isActive: true },
      { name: 'Complimentary Free Express Shipping', minOrderValue: 49900, maxOrderValue: null, charge: 0, estimatedDays: '2-4 Business Days', isActive: true },
    ],
  });
  console.log('  ✓ Shipping rules');

  // ─── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'edible-oils' },
      update: {},
      create: {
        name: 'Wood-Pressed Oils',
        slug: 'edible-oils',
        description: 'Traditional Mara Chekku wood-pressed cooking and therapeutic oils extracted below 38°C.',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'spice-powders' },
      update: {},
      create: {
        name: 'Stone-Ground Spices',
        slug: 'spice-powders',
        description: 'Single-origin spice powders ground slowly in stone chakkis preserving natural volatile oils.',
        imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1000&q=80',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'whole-spices' },
      update: {},
      create: {
        name: 'Whole Spices',
        slug: 'whole-spices',
        description: 'Hand-sorted, sun-dried unpolished whole spices sourced directly from farmer guilds.',
        imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'masala-blends' },
      update: {},
      create: {
        name: 'Heritage Masala Blends',
        slug: 'masala-blends',
        description: 'Royal regional spice formulations pounded in brass mortars and stone mills.',
        imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1000&q=80',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'gift-packs' },
      update: {},
      create: {
        name: 'Festive & Gift Boxes',
        slug: 'gift-packs',
        description: 'Curated wooden chests and artisanal brass tins for ceremonial and corporate gifting.',
        imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=80',
        sortOrder: 5,
      },
    }),
  ]);
  console.log('  ✓ Categories');

  const [oilsCat, spicePowderCat, wholeCat, masalaCat, giftCat] = categories;

  // ─── Clean Existing Product Records ────────────────────────────────────────
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  // ─── 25 Authentic Indian Products ──────────────────────────────────────────
  const products = [
    // 1. Pure Wood-Pressed Mustard Oil
    {
      data: {
        name: 'Pure Wood-Pressed Black Mustard Oil (Kachi Ghani)',
        slug: 'pure-wood-pressed-black-mustard-oil',
        sku: 'KV-OIL-MUSTARD-01',
        shortDescription: 'Traditional Rajasthan black mustard seed extraction in Vagai wood ghani. Intense natural pungency and deep amber clarity.',
        description: 'Extracted slowly in ancestral Vagai wooden mills operating at under 14 RPM to maintain extraction temperatures strictly below 38°C. Retains natural sinigrin, allylisothiocyanate pungency, and vital monounsaturated fatty acids.\n\nFree Fatty Acids: < 0.65%\nPungency Value: 0.32% AIT\nPackaging: Food-grade UV-protective amber glass bottle.',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight. Reseal cap tightly after each pour.',
        categoryId: oilsCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['mustard oil', 'kachi ghani', 'cold-pressed', 'wood-pressed', 'cooking oil']),
      },
      variants: [
        { name: '500 ml Bottle', sku: 'KV-MUST-500', price: 16500, compareAtPrice: 19500, stock: 120, isDefault: false, sortOrder: 0 },
        { name: '1 Litre Bottle', sku: 'KV-MUST-1L', price: 31000, compareAtPrice: 36000, stock: 180, isDefault: true, sortOrder: 1 },
        { name: '5 Litre Can', sku: 'KV-MUST-5L', price: 145000, compareAtPrice: 165000, stock: 45, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
    },

    // 2. Wood-Pressed Yellow Mustard Oil
    {
      data: {
        name: 'Wood-Pressed Yellow Mustard Oil (Peeli Sarson)',
        slug: 'wood-pressed-yellow-mustard-oil',
        sku: 'KV-OIL-YELMUST-02',
        shortDescription: 'Delicate, sweet-pungent oil pressed from premium indigenous yellow mustard seeds. Exceptional clarity and golden luster.',
        description: 'Prized in Kashmiri and Bengali culinary traditions for its subtle, sweet-spicy aroma. Cold-pressed without artificial refining, chemical solvents, or argemone contamination. Lab verified unadulterated.',
        storageInstructions: 'Store in an amber glass bottle in a dry ambient pantry.',
        categoryId: oilsCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['yellow mustard', 'peeli sarson', 'kachi ghani', 'organic oil']),
      },
      variants: [
        { name: '500 ml Bottle', sku: 'KV-YMUST-500', price: 18500, compareAtPrice: 22000, stock: 85, isDefault: false, sortOrder: 0 },
        { name: '1 Litre Bottle', sku: 'KV-YMUST-1L', price: 34500, compareAtPrice: 39500, stock: 130, isDefault: true, sortOrder: 1 },
        { name: '5 Litre Can', sku: 'KV-YMUST-5L', price: 162000, compareAtPrice: 185000, stock: 35, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1000&q=80',
    },

    // 3. Virgin Wood-Pressed Sesame Oil
    {
      data: {
        name: 'Virgin Wood-Pressed Sesame Oil (Gingelly / Nalla Ennai)',
        slug: 'virgin-wood-pressed-sesame-oil',
        sku: 'KV-OIL-SESAME-03',
        shortDescription: 'Ancestral Tamil Nadu Mara Chekku extraction with organic black palm jaggery. Rich in sesamol and natural antioxidants.',
        description: 'Prepared using traditional south Indian methods where heirloom black sesame seeds are gently crushed with organic jaggery in a single wooden pestle. Unfiltered, nutrient-dense, and non-greasy.',
        storageInstructions: 'Keep in dark cool pantry away from heat sources.',
        categoryId: oilsCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['sesame oil', 'gingelly', 'til oil', 'cold-pressed']),
      },
      variants: [
        { name: '500 ml Bottle', sku: 'KV-SES-500', price: 23500, compareAtPrice: 27500, stock: 95, isDefault: false, sortOrder: 0 },
        { name: '1 Litre Bottle', sku: 'KV-SES-1L', price: 44000, compareAtPrice: 51000, stock: 140, isDefault: true, sortOrder: 1 },
        { name: '5 Litre Can', sku: 'KV-SES-5L', price: 210000, compareAtPrice: 240000, stock: 25, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
    },

    // 4. Wood-Pressed Groundnut Oil
    {
      data: {
        name: 'Wood-Pressed Groundnut Oil (Peanut / Mungfali)',
        slug: 'wood-pressed-groundnut-oil',
        sku: 'KV-OIL-GNDNUT-04',
        shortDescription: 'Sun-dried Saurashtra red-skin peanuts slow-pressed in traditional stone and wooden ghanis. Rich nutty sweetness.',
        description: 'Retains natural phytosterols, resveratrol, and healthy oleic fatty acids. Excellent for frying and high-heat sautéeing with a natural smoke point exceeding 225°C.',
        storageInstructions: 'Store in cool ambient conditions. Avoid moist spoons.',
        categoryId: oilsCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['groundnut oil', 'peanut oil', 'mungfali tel', 'cooking oil']),
      },
      variants: [
        { name: '1 Litre Bottle', sku: 'KV-GND-1L', price: 29500, compareAtPrice: 34000, stock: 160, isDefault: true, sortOrder: 0 },
        { name: '5 Litre Can', sku: 'KV-GND-5L', price: 139000, compareAtPrice: 159000, stock: 50, isDefault: false, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    },

    // 5. Extra Virgin Cold-Pressed Coconut Oil
    {
      data: {
        name: 'Single-Origin Extra Virgin Coconut Oil',
        slug: 'single-origin-extra-virgin-coconut-oil',
        sku: 'KV-OIL-COCO-05',
        shortDescription: 'Raw, unrefined oil centrifuge-extracted from freshly harvested coastal Kerala organic coconut milk.',
        description: 'Water-clear virgin oil with a delicate fresh coconut aroma. Contains over 52% Lauric Acid. Perfect for both coastal culinary recipes and Ayurvedic hair/skin nourishment.',
        storageInstructions: 'Naturally solidifies below 24°C without any loss of quality. Liquefy in warm water.',
        categoryId: oilsCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['coconut oil', 'virgin coconut oil', 'kerala oil', 'nariyal tel']),
      },
      variants: [
        { name: '500 ml Glass Jar', sku: 'KV-COC-500', price: 26500, compareAtPrice: 31000, stock: 110, isDefault: false, sortOrder: 0 },
        { name: '1 Litre Glass Bottle', sku: 'KV-COC-1L', price: 49000, compareAtPrice: 56000, stock: 130, isDefault: true, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80',
    },

    // 6. Wood-Pressed Safflower Oil (Kusum Tel)
    {
      data: {
        name: 'Pure Wood-Pressed Safflower Oil (Kardi / Kusum)',
        slug: 'pure-wood-pressed-safflower-oil',
        sku: 'KV-OIL-SAFF-06',
        shortDescription: 'Cold-pressed from indigenous wild safflower seeds. High in polyunsaturated omega-6 and vitamin E.',
        description: 'Light, clear, and cholesterol-conscious cooking oil with high thermal stability. Cold extraction preserves natural tocotrienols.',
        storageInstructions: 'Store in cool ambient conditions.',
        categoryId: oilsCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['safflower oil', 'kusum tel', 'kardi', 'healthy cooking oil']),
      },
      variants: [
        { name: '1 Litre Bottle', sku: 'KV-SAF-1L', price: 36000, compareAtPrice: 42000, stock: 75, isDefault: true, sortOrder: 0 },
        { name: '5 Litre Can', sku: 'KV-SAF-5L', price: 169000, compareAtPrice: 195000, stock: 20, isDefault: false, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1000&q=80',
    },

    // 7. A2 Gir Cow Vedic Cultured Bilona Ghee
    {
      data: {
        name: 'A2 Gir Cow Vedic Cultured Bilona Ghee',
        slug: 'a2-gir-cow-vedic-cultured-bilona-ghee',
        sku: 'KV-GHEE-BILO-07',
        shortDescription: 'Slow-simmered over cow dung cakes from curd churned with wooden bilona. Golden granular texture with divine nutty aroma.',
        description: 'Made according to the authentic Vedic 5-step process: Whole raw milk from free-grazing indigenous Gir cows is boiled, naturally cultured into curd, churned using a bi-directional wooden pestle (bilona) at dawn, and melted slowly over mild firewood flame.\n\nNon-homogenized • Lab tested A2 beta-casein purity.',
        storageInstructions: 'Store at room temperature in the airtight ceramic glass jar provided. Do not refrigerate.',
        categoryId: oilsCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 12,
        tags: JSON.stringify(['a2 ghee', 'bilona ghee', 'gir cow', 'vedic ghee', 'pure cow ghee']),
      },
      variants: [
        { name: '500 ml Glass Jar', sku: 'KV-GHEE-500', price: 99000, compareAtPrice: 115000, stock: 60, isDefault: false, sortOrder: 0 },
        { name: '1 Litre Glass Jar', sku: 'KV-GHEE-1L', price: 189000, compareAtPrice: 220000, stock: 90, isDefault: true, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80',
    },

    // 8. Pure Cold-Pressed Flaxseed Oil
    {
      data: {
        name: 'Cold-Pressed Golden Flaxseed Oil (Alsi Tel)',
        slug: 'cold-pressed-golden-flaxseed-oil',
        sku: 'KV-OIL-FLAX-08',
        shortDescription: 'Unrefined, unheated therapeutic plant oil rich in Alpha-Linolenic Acid (ALA Omega-3). First-press cold virgin extraction.',
        description: 'Clean pressed from golden flaxseed kernels harvested in the Malwa plateau. Bottled immediately in dark amber glass to prevent oxidation.',
        storageInstructions: 'Keep in a dark cool place or refrigerate after opening to preserve delicate omega bonds.',
        categoryId: oilsCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['flaxseed oil', 'alsi tel', 'omega 3', 'raw oil']),
      },
      variants: [
        { name: '250 ml Bottle', sku: 'KV-FLX-250', price: 19500, compareAtPrice: 23000, stock: 70, isDefault: false, sortOrder: 0 },
        { name: '500 ml Bottle', sku: 'KV-FLX-500', price: 36000, compareAtPrice: 42000, stock: 85, isDefault: true, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=1000&q=80',
    },

    // 9. Salem High-Curcumin Turmeric Powder
    {
      data: {
        name: 'Salem High-Curcumin Turmeric Powder (5.2% Assayed Haldi)',
        slug: 'salem-high-curcumin-turmeric-powder',
        sku: 'KV-SPC-TURM-09',
        shortDescription: 'Unpolished Salem rhizomes stone-ground at low RPM. Natural deep saffron-gold pigment and earthy Ayurvedic aroma.',
        description: 'Cultivated in the mineral-rich soils of Salem, Tamil Nadu. Third-party NABL lab certified with guaranteed 5.2% natural curcuminoid concentration. Zero lead chromate, chalk, or artificial polish.',
        storageInstructions: 'Store in an airtight ceramic or stainless steel container away from direct sunlight.',
        categoryId: spicePowderCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['turmeric', 'haldi', 'high curcumin', 'salem turmeric', 'organic spice']),
      },
      variants: [
        { name: '250 g Pouch', sku: 'KV-TURM-250', price: 12000, compareAtPrice: 14500, stock: 150, isDefault: false, sortOrder: 0 },
        { name: '500 g Pouch', sku: 'KV-TURM-500', price: 22500, compareAtPrice: 26500, stock: 200, isDefault: true, sortOrder: 1 },
        { name: '1 kg Pouch', sku: 'KV-TURM-1KG', price: 42000, compareAtPrice: 49000, stock: 80, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1000&q=80',
    },

    // 10. Guntur & Kashmiri Vibrant Red Chilli Powder
    {
      data: {
        name: 'Vibrant Blend Red Chilli Powder (Guntur Heat & Kashmiri Hue)',
        slug: 'vibrant-blend-red-chilli-powder',
        sku: 'KV-SPC-CHIL-10',
        shortDescription: 'Stem-plucked sun-dried chillies stone pulverized without added oils or synthetic colorants.',
        description: 'Combines the fiery capsaicin warmth of Guntur Sannam chillies with the rich natural ASTA color value of Kashmiri Byadgi chillies. Pure, unadulterated spice with zero artificial dyes.',
        storageInstructions: 'Store in an airtight jar in a cool, dry pantry.',
        categoryId: spicePowderCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['red chilli', 'lal mirch', 'kashmiri mirch', 'guntur chilli']),
      },
      variants: [
        { name: '250 g Pouch', sku: 'KV-CHIL-250', price: 13000, compareAtPrice: 15500, stock: 140, isDefault: false, sortOrder: 0 },
        { name: '500 g Pouch', sku: 'KV-CHIL-500', price: 24500, compareAtPrice: 29000, stock: 190, isDefault: true, sortOrder: 1 },
        { name: '1 kg Pouch', sku: 'KV-CHIL-1KG', price: 46000, compareAtPrice: 54000, stock: 75, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    },

    // 11. Roasted Coriander Powder (Dhaniya)
    {
      data: {
        name: 'Slow-Roasted Coriander Powder (Ramganj Mandi Dhaniya)',
        slug: 'slow-roasted-coriander-powder',
        sku: 'KV-SPC-CORI-11',
        shortDescription: 'Rajasthan Ramganj Mandi whole seeds dry-roasted in iron pans before cold stone grinding. Citrusy, refreshing fragrance.',
        description: 'Prepared using traditional dry-roasting to activate volatile linalool essential oils before slow milling. Unbleached, fresh green-olive color.',
        storageInstructions: 'Keep sealed tightly in glass containers.',
        categoryId: spicePowderCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['coriander', 'dhaniya powder', 'roasted coriander', 'pure spice']),
      },
      variants: [
        { name: '250 g Pouch', sku: 'KV-CORI-250', price: 9500, compareAtPrice: 11500, stock: 160, isDefault: false, sortOrder: 0 },
        { name: '500 g Pouch', sku: 'KV-CORI-500', price: 18000, compareAtPrice: 21500, stock: 210, isDefault: true, sortOrder: 1 },
        { name: '1 kg Pouch', sku: 'KV-CORI-1KG', price: 34000, compareAtPrice: 40000, stock: 90, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1000&q=80',
    },

    // 12. Sun-Dried Amchur Powder
    {
      data: {
        name: 'Sun-Dried Green Mango Powder (Desi Amchur)',
        slug: 'sun-dried-green-mango-powder',
        sku: 'KV-SPC-AMCH-12',
        shortDescription: 'Sliced and sun-cured raw green mangoes from Awadh orchards. Tangy, natural sourness with zero starch fillers.',
        description: 'Made from unripened desi sour mangoes peeled, thinly sliced, sun-dried on cotton mats, and stone powdered. Authentic citrus tartness without citric acid additive.',
        storageInstructions: 'Keep in an airtight container away from moisture.',
        categoryId: spicePowderCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['amchur', 'mango powder', 'dry mango', 'spice powder']),
      },
      variants: [
        { name: '200 g Jar', sku: 'KV-AMC-200', price: 11000, compareAtPrice: 13000, stock: 95, isDefault: true, sortOrder: 0 },
        { name: '500 g Pouch', sku: 'KV-AMC-500', price: 25000, compareAtPrice: 29500, stock: 70, isDefault: false, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281081?auto=format&fit=crop&w=1000&q=80',
    },

    // 13. Roasted Cumin Powder (Bhuna Jeera)
    {
      data: {
        name: 'Stone-Pounded Roasted Cumin Powder (Bhuna Jeera)',
        slug: 'stone-pounded-roasted-cumin-powder',
        sku: 'KV-SPC-JEER-13',
        shortDescription: 'Artisanal slow roasted Nagaur cumin seeds, coarse-ground for raita, chaats, and buttermilk.',
        description: 'Dry roasted on heavy cast iron tavas until aromatic oils release, then coarsely stone pounded for immediate culinary release.',
        storageInstructions: 'Keep in airtight jar away from humidity.',
        categoryId: spicePowderCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['cumin powder', 'bhuna jeera', 'roasted jeera', 'indian spice']),
      },
      variants: [
        { name: '200 g Jar', sku: 'KV-JEEP-200', price: 14500, compareAtPrice: 17500, stock: 110, isDefault: true, sortOrder: 0 },
        { name: '500 g Pouch', sku: 'KV-JEEP-500', price: 32000, compareAtPrice: 38000, stock: 80, isDefault: false, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80',
    },

    // 14. Malabar Tellicherry Black Peppercorn (TGSEB)
    {
      data: {
        name: 'Malabar Tellicherry Black Peppercorn (TGSEB Extra-Bold)',
        slug: 'malabar-tellicherry-black-peppercorn',
        sku: 'KV-WHL-PEPP-14',
        shortDescription: 'Extra-bold 4.75mm berries from Wayanad rainforest canopy. Deep woody citrus bite with high piperine content.',
        description: 'TGSEB (Tellicherry Garbled Special Extra Bold) represents the highest grade of black pepper on earth. Left on the vine to mature until fully plump and sun-dried to black wrinkled perfection.',
        storageInstructions: 'Store whole in glass spice grinder or airtight tin.',
        categoryId: wholeCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['black pepper', 'tellicherry', 'kali mirch', 'whole spices', 'malabar pepper']),
      },
      variants: [
        { name: '100 g Jar', sku: 'KV-PEP-100', price: 14000, compareAtPrice: 16500, stock: 130, isDefault: false, sortOrder: 0 },
        { name: '250 g Jar', sku: 'KV-PEP-250', price: 32000, compareAtPrice: 38000, stock: 160, isDefault: true, sortOrder: 1 },
        { name: '500 g Pouch', sku: 'KV-PEP-500', price: 59000, compareAtPrice: 69000, stock: 90, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80',
    },

    // 15. Idukki Green Cardamom Pods (8mm Bold)
    {
      data: {
        name: 'Idukki Highland Green Cardamom (8mm+ Jumbo Pods)',
        slug: 'idukki-highland-green-cardamom',
        sku: 'KV-WHL-CARD-15',
        shortDescription: 'Hand-picked in the misty Cardamom Hills of Kerala. Intensely aromatic, plump jade pods filled with resinous black seeds.',
        description: 'Sourced from elevation of 1,200m in Idukki. Naturally shade-dried without sulfur treatment or artificial coloring.',
        storageInstructions: 'Keep in an airtight jar in a dark place to preserve volatile terpinyl acetate oils.',
        categoryId: wholeCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['cardamom', 'elaichi', 'green cardamom', 'idukki spices']),
      },
      variants: [
        { name: '50 g Glass Jar', sku: 'KV-CRD-50', price: 24000, compareAtPrice: 28000, stock: 90, isDefault: false, sortOrder: 0 },
        { name: '100 g Glass Jar', sku: 'KV-CRD-100', price: 45000, compareAtPrice: 53000, stock: 120, isDefault: true, sortOrder: 1 },
        { name: '250 g Pouch', sku: 'KV-CRD-250', price: 105000, compareAtPrice: 125000, stock: 50, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1000&q=80',
    },

    // 16. Kashmiri Mongra Saffron (Grade A1 Kesar)
    {
      data: {
        name: 'Kashmiri Mongra Saffron (Pure Pampore Grade A1 Kesar)',
        slug: 'kashmiri-mongra-saffron',
        sku: 'KV-WHL-SAFF-16',
        shortDescription: '100% pure deep carmine stigmas harvested from purple crocus flowers in Pampore, Kashmir. Highest crocin and safranal potency.',
        description: 'Only the pure red tips (Mongra) of the flower are selected without yellow style fibers. Distinctive sweet honeyed hay aroma with brilliant crimson release in warm milk.',
        storageInstructions: 'Store in the airtight sealed glass vial away from light.',
        categoryId: wholeCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['saffron', 'kesar', 'kashmiri saffron', 'mongra saffron', 'pure kesar']),
      },
      variants: [
        { name: '1 Gram Vial', sku: 'KV-SAF-1G', price: 39500, compareAtPrice: 47500, stock: 80, isDefault: true, sortOrder: 0 },
        { name: '2 Gram Vial', sku: 'KV-SAF-2G', price: 75000, compareAtPrice: 89000, stock: 60, isDefault: false, sortOrder: 1 },
        { name: '5 Gram Brass Box', sku: 'KV-SAF-5G', price: 175000, compareAtPrice: 210000, stock: 35, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1000&q=80',
    },

    // 17. Jodhpur Whole Cumin Seeds
    {
      data: {
        name: 'Jodhpur Bold Cumin Seeds (Unpolished Jeera)',
        slug: 'jodhpur-bold-cumin-seeds',
        sku: 'KV-WHL-CUMN-17',
        shortDescription: 'Crisp, aromatic whole cumin seeds machine-sorted from Rajasthan desert farms. Zero dust or mud clumps.',
        description: 'Essential base for Indian tadkas. Rich in cuminaldehyde essential oil that releases immediately in hot wood-pressed oil.',
        storageInstructions: 'Keep in an airtight jar in dry surroundings.',
        categoryId: wholeCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['cumin seeds', 'jeera', 'whole jeera', 'organic spices']),
      },
      variants: [
        { name: '250 g Pouch', sku: 'KV-JRS-250', price: 16000, compareAtPrice: 19000, stock: 140, isDefault: false, sortOrder: 0 },
        { name: '500 g Pouch', sku: 'KV-JRS-500', price: 29500, compareAtPrice: 35000, stock: 180, isDefault: true, sortOrder: 1 },
        { name: '1 kg Pouch', sku: 'KV-JRS-1KG', price: 56000, compareAtPrice: 66000, stock: 85, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1596040033282-3e2840ac2b6f?auto=format&fit=crop&w=1000&q=80',
    },

    // 18. Ceylon True Cinnamon Quills
    {
      data: {
        name: 'Ceylon True Cinnamon Quills (C5 Special Grade Dalchini)',
        slug: 'ceylon-true-cinnamon-quills',
        sku: 'KV-WHL-CINN-18',
        shortDescription: 'Fragrant multi-layered soft quills. Low in liver-toxic coumarin, naturally sweet and gentle.',
        description: 'True Ceylon (Cinnamomum verum) is composed of dozens of delicate paper-thin inner bark rolls, unlike coarse woody cassia bark. Safe for daily morning tea infusions and wellness decoctions.',
        storageInstructions: 'Store whole in an airtight glass container.',
        categoryId: wholeCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['cinnamon', 'dalchini', 'ceylon cinnamon', 'true cinnamon']),
      },
      variants: [
        { name: '100 g Jar', sku: 'KV-CIN-100', price: 16500, compareAtPrice: 19500, stock: 110, isDefault: true, sortOrder: 0 },
        { name: '250 g Pouch', sku: 'KV-CIN-250', price: 37000, compareAtPrice: 44000, stock: 85, isDefault: false, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80',
    },

    // 19. Madurai Royal Whole Cloves
    {
      data: {
        name: 'Madurai Bold Whole Cloves (Handpicked Laung)',
        slug: 'madurai-bold-whole-cloves',
        sku: 'KV-WHL-CLOV-19',
        shortDescription: 'Unbroken flower buds with intact full crowns. Exceptionally high eugenol oil content.',
        description: 'Whole dried aromatic flower buds from ancient coastal groves. Crisp, resinous bite that releases deep warmth in biryanis and chai.',
        storageInstructions: 'Keep sealed in airtight glass spice jars.',
        categoryId: wholeCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['cloves', 'laung', 'whole cloves', 'indian spices']),
      },
      variants: [
        { name: '100 g Jar', sku: 'KV-CLV-100', price: 17500, compareAtPrice: 21000, stock: 95, isDefault: true, sortOrder: 0 },
        { name: '250 g Jar', sku: 'KV-CLV-250', price: 39000, compareAtPrice: 46500, stock: 75, isDefault: false, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    },

    // 20. Pounded Shahi Garam Masala
    {
      data: {
        name: 'Pounded Shahi Garam Masala (16 Heritage Spices Blend)',
        slug: 'pounded-shahi-garam-masala',
        sku: 'KV-MSL-SHAH-20',
        shortDescription: 'Ancestral Awadhi royal recipe pounded with mace, star anise, black cardamom, stone flower, and royal nutmeg.',
        description: 'Formulated with 16 dry-roasted spices: Tellicherry pepper, Idukki elaichi, black cardamom, cinnamon, cloves, dagad phool, javantry, and bay leaves. Imparts aromatic majesty to rich gravies, dal makhani, and curries.',
        storageInstructions: 'Always keep jar sealed tightly to preserve volatile top notes.',
        categoryId: masalaCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['garam masala', 'shahi garam masala', 'masala blend', 'pounded spice']),
      },
      variants: [
        { name: '100 g Glass Jar', sku: 'KV-SGM-100', price: 12500, compareAtPrice: 15000, stock: 120, isDefault: false, sortOrder: 0 },
        { name: '250 g Glass Jar', sku: 'KV-SGM-250', price: 28000, compareAtPrice: 33000, stock: 160, isDefault: true, sortOrder: 1 },
        { name: '500 g Pouch', sku: 'KV-SGM-500', price: 52000, compareAtPrice: 62000, stock: 85, isDefault: false, sortOrder: 2 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1000&q=80',
    },

    // 21. Royal Dum Biryani Masala
    {
      data: {
        name: 'Royal Dum Biryani Masala (Roasted Whole Spice Formulation)',
        slug: 'royal-dum-biryani-masala',
        sku: 'KV-MSL-BIRY-21',
        shortDescription: 'Handcrafted with Shahi Jeera, Javitri, Rose Petals, and Stone Flower for authentic Nizami dum aroma.',
        description: 'Created following old Deccani royal kitchen proportions. Elevates long-grain basmati and spiced curries without harsh artificial spice extracts.',
        storageInstructions: 'Store in cool ambient pantry.',
        categoryId: masalaCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['biryani masala', 'dum biryani', 'shahi masala', 'rice spice']),
      },
      variants: [
        { name: '100 g Jar', sku: 'KV-BRY-100', price: 13500, compareAtPrice: 16000, stock: 110, isDefault: true, sortOrder: 0 },
        { name: '250 g Jar', sku: 'KV-BRY-250', price: 29500, compareAtPrice: 35000, stock: 95, isDefault: false, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    },

    // 22. Vedic Kitchen King Curry Blend
    {
      data: {
        name: 'Vedic Kitchen King All-Purpose Curry Blend',
        slug: 'vedic-kitchen-king-curry-blend',
        sku: 'KV-MSL-KING-22',
        shortDescription: 'Artisanal daily sabzi and dal tempering blend crafted with 20 stone-roasted digestive spices.',
        description: 'Balanced with cumin, coriander, fenugreek leaves, dried ginger, and hing. Provides rich golden gravy body and appetizing aroma.',
        storageInstructions: 'Keep in an airtight container.',
        categoryId: masalaCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['kitchen king', 'curry powder', 'sabzi masala', 'daily spices']),
      },
      variants: [
        { name: '200 g Jar', sku: 'KV-KNG-200', price: 11500, compareAtPrice: 14000, stock: 130, isDefault: true, sortOrder: 0 },
        { name: '500 g Pouch', sku: 'KV-KNG-500', price: 26000, compareAtPrice: 31000, stock: 90, isDefault: false, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    },

    // 23. Authentic Sambhar & Rasam Podi
    {
      data: {
        name: 'Temple-Style Sambhar & Rasam Podi (Stone Ground)',
        slug: 'temple-style-sambhar-and-rasam-podi',
        sku: 'KV-MSL-SAMB-23',
        shortDescription: 'Traditional Tamil Brahmin recipe with roasted lentils, curry leaves, Byadgi chillies, and Asafoetida.',
        description: 'Dry roasted slowly over mild firewood flame and coarse ground. Creates authentic aromatic South Indian sambhar with thick body and divine fragrance.',
        storageInstructions: 'Keep in an airtight container away from moisture.',
        categoryId: masalaCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: false,
        taxRate: 5,
        tags: JSON.stringify(['sambhar podi', 'rasam powder', 'south indian masala', 'temple recipe']),
      },
      variants: [
        { name: '250 g Pouch', sku: 'KV-SMB-250', price: 13000, compareAtPrice: 15500, stock: 120, isDefault: true, sortOrder: 0 },
        { name: '500 g Pouch', sku: 'KV-SMB-500', price: 24000, compareAtPrice: 28500, stock: 85, isDefault: false, sortOrder: 1 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1000&q=80',
    },

    // 24. Imperial Pancha-Ghani Oil Chest
    {
      data: {
        name: 'The Imperial Pancha-Ghani Heritage Oil Chest',
        slug: 'imperial-pancha-ghani-heritage-oil-chest',
        sku: 'KV-GIFT-OIL-24',
        shortDescription: 'Solid seasoned Sheesham wood chest with brass inlays containing 500ml bottles of 5 cold-pressed oils.',
        description: 'Contains 5 cold-pressed master bottles:\n1. Wood-Pressed Black Mustard Oil (500ml)\n2. Virgin Wood-Pressed Sesame Oil (500ml)\n3. Wood-Pressed Groundnut Oil (500ml)\n4. Single-Origin Virgin Coconut Oil (500ml)\n5. Wood-Pressed Safflower Oil (500ml)\n\nPresented in an artisanal gift box with certificates of laboratory purity.',
        storageInstructions: 'Store gift chest in a cool ambient spot.',
        categoryId: giftCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['gift pack', 'oil hamper', 'festive box', 'corporate gifting', 'wooden chest']),
      },
      variants: [
        { name: 'Artisanal Wooden Gift Box (5 x 500ml)', sku: 'KV-GIFT-5X500', price: 155000, compareAtPrice: 185000, stock: 40, isDefault: true, sortOrder: 0 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=80',
    },

    // 25. Maharaja Heritage Spice Treasure Box
    {
      data: {
        name: 'Maharaja Heritage Spice Treasure Box',
        slug: 'maharaja-heritage-spice-treasure-box',
        sku: 'KV-GIFT-SPIC-25',
        shortDescription: 'Artisanal brass-accented tin caddy containing Tellicherry Pepper, Salem Turmeric, Green Cardamom, and Kashmiri Saffron.',
        description: 'An auspicious culinary royal gift for Diwali, weddings, and discerning gourmet chefs. Contains sealed glass jars of Grade A1 Saffron, 8mm Cardamom, Tellicherry Pepper, and Shahi Garam Masala.',
        storageInstructions: 'Store in cool ambient conditions.',
        categoryId: giftCat.id,
        status: 'PUBLISHED' as const,
        isFeatured: true,
        taxRate: 5,
        tags: JSON.stringify(['spice gift', 'treasure box', 'royal spices', 'festive hamper']),
      },
      variants: [
        { name: 'Royal Gift Hamper Box', sku: 'KV-GIFT-ROYAL', price: 185000, compareAtPrice: 220000, stock: 35, isDefault: true, sortOrder: 0 },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  // ─── Insert All Products & Variants into PostgreSQL ────────────────────────
  for (const p of products) {
    const createdProduct = await prisma.product.create({
      data: {
        ...p.data,
        images: {
          create: [{ url: p.imageUrl, altText: p.data.name, sortOrder: 0 }],
        },
        variants: {
          create: p.variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stock: v.stock,
            isDefault: v.isDefault,
            sortOrder: v.sortOrder,
            lowStockThreshold: 10,
          })),
        },
      },
    });
    console.log(`  ✓ Product created: ${createdProduct.name}`);
  }

  // ─── Promo Coupon ──────────────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'VEDIC10' },
    update: {},
    create: {
      code: 'VEDIC10',
      description: '10% off on first order of cold-pressed oils and heritage spices',
      discountType: 'PERCENTAGE',
      discountValue: 1000, // 10%
      minOrderValue: 49900,
      maxUses: 1000,
      maxUsesPerUser: 1,
      isActive: true,
    },
  });
  console.log('  ✓ Promo coupon: VEDIC10');

  console.log('\n✅ Seed complete! All 25 products, variants, and imagery now live in Cloud Database.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
