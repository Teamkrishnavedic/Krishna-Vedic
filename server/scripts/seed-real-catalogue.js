const path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('🚀 Starting Krishnavedic Real Catalogue Population...');

  // ─── 1. Ensure / Update 6 Core Categories ──────────────────────────────────
  const categoryDefs = [
    {
      name: 'Cold-Pressed Oils',
      slug: 'cold-pressed-oils',
      description: 'Ancestral wood-pressed and cold-pressed edible oils extracted in traditional wooden ghanis below 38°C.',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 1,
    },
    {
      name: 'Flour (Atta)',
      slug: 'flour-atta',
      description: '100% natural, whole grain stone-ground flours. Freshly milled retaining wheat germ and dietary bran.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 2,
    },
    {
      name: 'Spices & Masalas',
      slug: 'spices-masalas',
      description: 'Single-origin spices and authentic royal blends slow-pounded in stone chakkis preserving natural essential oils.',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 3,
    },
    {
      name: 'Whole Grains & Cereals',
      slug: 'whole-grains-cereals',
      description: 'Unpolished, sun-ripened traditional whole grains, millets, and porridge directly from local Rajasthani farms.',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 4,
    },
    {
      name: 'Ghee, Honey & Other Products',
      slug: 'ghee-honey-other-products',
      description: 'Pure indigenous Desi cow & buffalo bilona ghee, raw forest honey, traditional jaggery, and pantry essentials.',
      imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 5,
    },
    {
      name: 'Oil Cakes (Khal)',
      slug: 'oil-cakes-khal',
      description: 'Pure organic oil cake meal byproduct from cold-pressing. Nutrient-dense livestock feed and natural organic compost.',
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
      sortOrder: 6,
    },
  ];

  // Map existing categories if they have legacy slugs
  const legacyCatMapping = {
    'oil': 'cold-pressed-oils',
    'masala-blends': 'spices-masalas',
    'ghee-honey': 'ghee-honey-other-products',
  };

  for (const [oldSlug, newSlug] of Object.entries(legacyCatMapping)) {
    const existing = await prisma.category.findUnique({ where: { slug: oldSlug } });
    if (existing) {
      console.log(`  Updating legacy category slug "${oldSlug}" -> "${newSlug}"`);
      await prisma.category.update({
        where: { slug: oldSlug },
        data: { slug: newSlug },
      });
    }
  }

  const categoryMap = {};
  for (const def of categoryDefs) {
    const cat = await prisma.category.upsert({
      where: { slug: def.slug },
      update: {
        name: def.name,
        description: def.description,
        imageUrl: def.imageUrl,
        sortOrder: def.sortOrder,
      },
      create: def,
    });
    categoryMap[def.slug] = cat.id;
    console.log(`  ✓ Category: ${cat.name} (${cat.slug}) [ID: ${cat.id}]`);
  }

  // ─── 2. Definition of 33 Products from Customer Price List ───────────────────
  const productCatalogue = [
    // ── Category A: Cold-Pressed Oils (8 products) ──
    {
      name: 'Black Mustard Oil (Kali Sarson Tel)',
      slug: 'black-mustard-oil-kali-sarson-tel',
      matchLegacySlugs: ['pure-wood-pressed-black-mustard-oil'],
      categorySlug: 'cold-pressed-oils',
      sku: 'KV-OIL-BLKMUST',
      shortDescription: 'Traditional Rajasthan cold-pressed black mustard oil extracted in wooden/stone ghani. High natural pungency, 100% pure kachi ghani.',
      description: 'Extracted slowly in ancestral wooden mills operating under 14 RPM to maintain cold-press extraction temperatures strictly below 38°C. Retains natural sinigrin, allylisothiocyanate pungency, and vital monounsaturated fatty acids.\n\nUnit: Per Kilogram (kg)\nPrice: ₹230 / kg\nPackaging: Food-grade container.\nPurity: 100% Unrefined & Chemical-Free.',
      isFeatured: true,
      price: 23000, // ₹230 per kg
      unitName: '1 kg',
      stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
      altText: 'Cold-Pressed Black Mustard Oil (Kali Sarson Tel)',
      tags: ['mustard oil', 'kali sarson', 'kachi ghani', 'cold-pressed', 'cooking oil'],
    },
    {
      name: 'Yellow Mustard Oil (Peeli Sarson Tel)',
      slug: 'yellow-mustard-oil-peeli-sarson-tel',
      matchLegacySlugs: ['wood-pressed-yellow-mustard-oil'],
      categorySlug: 'cold-pressed-oils',
      sku: 'KV-OIL-YELMUST',
      shortDescription: 'Delicate, sweet-pungent oil pressed from premium indigenous yellow mustard seeds. Exceptional clarity and golden luster.',
      description: 'Prized for its subtle, sweet-spicy aroma. Cold-pressed without artificial refining, chemical solvents, or argemone contamination.\n\nUnit: Per Kilogram (kg)\nPrice: ₹300 / kg\nPackaging: Food-grade container.',
      isFeatured: true,
      price: 30000, // ₹300 per kg
      unitName: '1 kg',
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1000&q=80',
      altText: 'Cold-Pressed Yellow Mustard Oil (Peeli Sarson Tel)',
      tags: ['yellow mustard', 'peeli sarson', 'cold-pressed', 'kachi ghani'],
    },
    {
      name: 'Groundnut Oil (Moongfali Tel)',
      slug: 'groundnut-oil-moongfali-tel',
      matchLegacySlugs: ['wood-pressed-groundnut-oil'],
      categorySlug: 'cold-pressed-oils',
      sku: 'KV-OIL-GNDNUT',
      shortDescription: 'Sun-dried Saurashtra red-skin peanuts slow-pressed in traditional wooden ghanis. Rich nutty sweetness and high smoke point.',
      description: 'Retains natural phytosterols, resveratrol, and healthy oleic fatty acids. Excellent for frying and deep cooking.\n\nUnit: Per Kilogram (kg)\nPrice: ₹280 / kg\nPackaging: Food-grade container.',
      isFeatured: true,
      price: 28000, // ₹280 per kg
      unitName: '1 kg',
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=1000&q=80',
      altText: 'Cold-Pressed Groundnut Oil (Moongfali Tel)',
      tags: ['groundnut oil', 'moongfali tel', 'peanut oil', 'cold-pressed'],
    },
    {
      name: 'Sesame Oil (Til Tel)',
      slug: 'sesame-oil-til-tel',
      matchLegacySlugs: ['virgin-wood-pressed-sesame-oil'],
      categorySlug: 'cold-pressed-oils',
      sku: 'KV-OIL-SESAME',
      shortDescription: 'Virgin cold-pressed sesame oil extracted from black sesame seeds in wooden pestles. Rich in sesamol and antioxidants.',
      description: 'Prepared using traditional stone and wooden extraction methods. Unfiltered, nutrient-dense, and non-greasy.\n\nUnit: Per Kilogram (kg)\nPrice: ₹350 / kg\nPackaging: Food-grade container.',
      isFeatured: true,
      price: 35000, // ₹350 per kg
      unitName: '1 kg',
      stock: 90,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
      altText: 'Cold-Pressed Sesame Oil (Til Tel)',
      tags: ['sesame oil', 'til tel', 'gingelly', 'cold-pressed'],
    },
    {
      name: 'Coconut Oil (Nariyal Tel)',
      slug: 'coconut-oil-nariyal-tel',
      matchLegacySlugs: ['single-origin-extra-virgin-coconut-oil'],
      categorySlug: 'cold-pressed-oils',
      sku: 'KV-OIL-COCONUT',
      shortDescription: '100% pure cold-pressed coconut oil from sun-dried copra. Unrefined, unbleached, retaining medium-chain triglycerides (MCTs).',
      description: 'Pure wood-pressed coconut oil with natural tropical coconut aroma. Ideal for edible culinary uses as well as hair and skin nourishment.\n\nUnit: Per Kilogram (kg)\nPrice: ₹700 / kg\nPackaging: Food-grade container.',
      isFeatured: true,
      price: 70000, // ₹700 per kg
      unitName: '1 kg',
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80',
      altText: 'Cold-Pressed Coconut Oil (Nariyal Tel)',
      tags: ['coconut oil', 'nariyal tel', 'cold-pressed', 'pure coconut'],
    },
    {
      name: 'Almond Oil (Badam Tel)',
      slug: 'almond-oil-badam-tel',
      categorySlug: 'cold-pressed-oils',
      sku: 'KV-OIL-ALMOND',
      shortDescription: '100% pure sweet almond oil cold-pressed from premium sweet almonds. Rich in Vitamin E, therapeutic nourishment for hair and skin.',
      description: 'Extracted slowly at low ambient temperatures without chemicals or mineral oil adulteration. Superb restorative oil for brain vitality, skin glow, and hair roots.\n\nUnit: Per Kilogram (kg)\nPrice: ₹3,500 / kg\nPackaging: Food-grade container.',
      isFeatured: true,
      price: 350000, // ₹3,500 per kg
      unitName: '1 kg',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=80',
      altText: 'Pure Sweet Almond Oil (Badam Tel)',
      tags: ['almond oil', 'badam tel', 'sweet almond', 'cold-pressed'],
    },
    {
      name: 'Castor Oil (Arandi Tel)',
      slug: 'castor-oil-arandi-tel',
      categorySlug: 'cold-pressed-oils',
      sku: 'KV-OIL-CASTOR',
      shortDescription: 'Pure cold-pressed castor oil pressed from select ricinus seeds. Rich in ricinoleic acid for Ayurvedic hair care and skin therapies.',
      description: 'Thick, unadulterated cold-pressed castor oil. Renowned in Ayurvedic traditions for deep conditioning hair strands, eyebrow thickness, and natural wellness applications.\n\nUnit: Per Kilogram (kg)\nPrice: ₹580 / kg\nPackaging: Food-grade container.',
      isFeatured: false,
      price: 58000, // ₹580 per kg
      unitName: '1 kg',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80',
      altText: 'Cold-Pressed Castor Oil (Arandi Tel)',
      tags: ['castor oil', 'arandi tel', 'cold-pressed', 'ayurvedic oil'],
    },
    {
      name: 'Flaxseed Oil (Alsi Tel)',
      slug: 'flaxseed-oil-alsi-tel',
      matchLegacySlugs: ['cold-pressed-golden-flaxseed-oil'],
      categorySlug: 'cold-pressed-oils',
      sku: 'KV-OIL-FLAX',
      shortDescription: 'Raw cold-pressed flaxseed oil extracted below 35°C from golden brown flaxseeds. One of nature’s richest plant sources of Omega-3 ALA.',
      description: 'Extracted without heat or chemical solvents. Retains natural lignans, dietary fatty acids, and vibrant nutty clarity.\n\nUnit: Per Kilogram (kg)\nPrice: ₹680 / kg\nPackaging: Food-grade container.',
      isFeatured: false,
      price: 68000, // ₹680 per kg
      unitName: '1 kg',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1000&q=80',
      altText: 'Cold-Pressed Flaxseed Oil (Alsi Tel)',
      tags: ['flaxseed oil', 'alsi tel', 'omega 3', 'cold-pressed'],
    },

    // ── Category B: Flour (Atta) (4 products) ──
    {
      name: 'Wheat Flour (Gehun Atta)',
      slug: 'wheat-flour-gehun-atta',
      categorySlug: 'flour-atta',
      sku: 'KV-FLR-WHEAT',
      shortDescription: 'Fresh stone-ground 100% whole wheat flour from selected high-protein grains. Unbleached, retaining wheat germ and bran.',
      description: 'Stone-milled slowly to prevent heating of the flour, preserving delicate nutrients, natural sweetness, and dietary fiber. Yields soft, fragrant rotis.\n\nUnit: Per Kilogram (kg)\nPrice: ₹40 / kg\nPackaging: Sealed food-grade packaging.',
      isFeatured: true,
      price: 4000, // ₹40 per kg
      unitName: '1 kg',
      stock: 300,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      altText: 'Stone-Ground Whole Wheat Flour (Gehun Atta)',
      tags: ['wheat flour', 'gehun atta', 'chakki atta', 'stone ground'],
    },
    {
      name: 'Pearl Millet Flour (Bajra Atta)',
      slug: 'pearl-millet-flour-bajra-atta',
      categorySlug: 'flour-atta',
      sku: 'KV-FLR-BAJRA',
      shortDescription: 'Authentic Rajasthani Pearl Millet Flour (Bajra Atta) freshly stone-ground. Gluten-free, rich in iron, magnesium, and dietary fiber.',
      description: 'Milled from indigenous Rajasthani bajra pearls. A wholesome winter staple known for generating natural warmth, boosting digestion, and delivering sustained energy.\n\nUnit: Per Kilogram (kg)\nPrice: ₹35 / kg\nPackaging: Sealed food-grade packaging.',
      isFeatured: true,
      price: 3500, // ₹35 per kg
      unitName: '1 kg',
      stock: 250,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80',
      altText: 'Stone-Ground Pearl Millet Flour (Bajra Atta)',
      tags: ['bajra atta', 'pearl millet flour', 'rajasthan bajra', 'gluten free'],
    },
    {
      name: 'Maize Flour (Makka Atta)',
      slug: 'maize-flour-makka-atta',
      categorySlug: 'flour-atta',
      sku: 'KV-FLR-MAKKA',
      shortDescription: 'Stone-ground yellow Maize Flour (Makka Atta) milled from sun-dried sweet corn kernels. Golden hue, perfect for classic makki ki roti.',
      description: 'Stone ground from whole golden corn kernels. High in carotenoids, dietary fiber, and authentic rustic taste. Ideal accompaniment for winter sarson ka saag.\n\nUnit: Per Kilogram (kg)\nPrice: ₹70 / kg\nPackaging: Sealed food-grade packaging.',
      isFeatured: false,
      price: 7000, // ₹70 per kg
      unitName: '1 kg',
      stock: 200,
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1000&q=80',
      altText: 'Stone-Ground Maize Flour (Makka Atta)',
      tags: ['makka atta', 'maize flour', 'cornmeal', 'makki ki roti'],
    },
    {
      name: 'Multigrain Flour (Multigrain Atta)',
      slug: 'multigrain-flour-multigrain-atta',
      categorySlug: 'flour-atta',
      sku: 'KV-FLR-MULTI',
      shortDescription: 'Nutrient-dense Vedic Multigrain Flour blended from whole wheat, barley, pearl millet, chickpeas, and oats. High protein and fiber.',
      description: 'Formulated in ancient Ayurvedic proportions combining whole wheat, barley (jau), bajra, chana, and whole grains. Promotes healthy glycemic balance and digestive wellness.\n\nUnit: Per Kilogram (kg)\nPrice: ₹65 / kg\nPackaging: Sealed food-grade packaging.',
      isFeatured: true,
      price: 6500, // ₹65 per kg
      unitName: '1 kg',
      stock: 200,
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',
      altText: 'Artisanal Multigrain Flour (Multigrain Atta)',
      tags: ['multigrain atta', 'mixed grain flour', 'dietary flour', 'healthy atta'],
    },

    // ── Category C: Spices & Masalas (5 products) ──
    {
      name: 'Coriander (Dhaniya)',
      slug: 'coriander-dhaniya',
      categorySlug: 'spices-masalas',
      sku: 'KV-SPC-CORIANDER',
      shortDescription: 'Single-origin stone-ground Coriander Powder (Dhaniya) from select green coriander seeds. Distinct citrusy, warm floral aroma.',
      description: 'Milled from whole coriander seeds harvested in Rajasthan. Sun-dried and cold-pounded to protect volatile aromatic linalool oils. Free from fillers or artificial color.\n\nUnit: Per Kilogram (kg)\nPrice: ₹260 / kg\nPackaging: Airtight moisture-barrier pouch.',
      isFeatured: true,
      price: 26000, // ₹260 per kg
      unitName: '1 kg',
      stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1000&q=80',
      altText: 'Stone-Ground Coriander Powder (Dhaniya)',
      tags: ['dhaniya', 'coriander powder', 'spices', 'stone ground'],
    },
    {
      name: 'Turmeric Powder (Haldi)',
      slug: 'turmeric-powder-haldi',
      matchLegacySlugs: ['salem-high-curcumin-turmeric-powder'],
      categorySlug: 'spices-masalas',
      sku: 'KV-SPC-TURMERIC',
      shortDescription: 'High-curcumin pure Turmeric Powder (Haldi) stone-ground from unpolished whole turmeric fingers. Vibrant deep golden colour.',
      description: 'Hand-sorted turmeric fingers ground slowly in stone chakkis without artificial heating. High natural curcumin content, earthy warmth, and therapeutic Ayurvedic potency.\n\nUnit: Per Kilogram (kg)\nPrice: ₹350 / kg\nPackaging: Light-protective pouch.',
      isFeatured: true,
      price: 35000, // ₹350 per kg
      unitName: '1 kg',
      stock: 180,
      imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1000&q=80',
      altText: 'Pure Stone-Ground Turmeric Powder (Haldi)',
      tags: ['turmeric powder', 'haldi', 'curcumin', 'stone pounded'],
    },
    {
      name: 'Red Chilli (Lal Mirch)',
      slug: 'red-chilli-lal-mirch',
      matchLegacySlugs: ['vibrant-blend-red-chilli-powder'],
      categorySlug: 'spices-masalas',
      sku: 'KV-SPC-REDCHILLI',
      shortDescription: 'Authentic stone-ground Red Chilli Powder (Lal Mirch) from sun-dried whole chillies. Rich crimson red hue and balanced pungent heat.',
      description: 'Slow ground from whole whole-stem chillies. Free from Sudan dye, brick dust, or synthetic capsicum extracts. Authentic fiery kick and natural brilliant color.\n\nUnit: Per Kilogram (kg)\nPrice: ₹350 / kg\nPackaging: Airtight spice pouch.',
      isFeatured: true,
      price: 35000, // ₹350 per kg
      unitName: '1 kg',
      stock: 160,
      imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1000&q=80',
      altText: 'Stone-Ground Red Chilli Powder (Lal Mirch)',
      tags: ['red chilli', 'lal mirch', 'pure mirch powder', 'spices'],
    },
    {
      name: 'Whole Spices (Khade Masale)',
      slug: 'whole-spices-khade-masale',
      categorySlug: 'spices-masalas',
      sku: 'KV-SPC-WHOLE',
      shortDescription: 'Hand-selected premium Whole Spices (Khade Masale) mix including cinnamon, cardamom, black pepper, cloves, bay leaf, and star anise.',
      description: 'Unpolished, whole natural spices sourced directly from origin guilds. Sun-dried and sorted for clean, intense aromatics. Perfect for tadka, biryanis, and slow-simmered gravies.\n\nUnit: Per 100 grams (100 g)\nPrice: ₹50 / 100 g\nPackaging: Resealable freshness pouch.',
      isFeatured: true,
      price: 5000, // ₹50 per 100 g (CRITICAL: preserve 100g unit)
      unitName: '100 g',
      stock: 250,
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80',
      altText: 'Aromatic Whole Spices (Khade Masale)',
      tags: ['whole spices', 'khade masale', 'sabut masale', 'tadka'],
    },
    {
      name: 'Ground Garam Masala',
      slug: 'ground-garam-masala',
      categorySlug: 'spices-masalas',
      sku: 'KV-SPC-GARAM',
      shortDescription: 'Masterfully roasted and stone-ground Garam Masala blend of imperial whole spices. A fragrant pinch elevates curries and dals.',
      description: 'Slow-roasted on low flame and stone pulverized. Contains roasted cumin, coriander, black cardamom, cloves, cinnamon, mace, and nutmeg. No starches or salt added.\n\nUnit: Per 100 grams (100 g)\nPrice: ₹90 / 100 g\nPackaging: Airtight aroma-seal jar/pouch.',
      isFeatured: true,
      price: 9000, // ₹90 per 100 g (CRITICAL: preserve 100g unit)
      unitName: '100 g',
      stock: 220,
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1000&q=80',
      altText: 'Stone-Ground Garam Masala Powder',
      tags: ['garam masala', 'ground masala', 'royal spice blend'],
    },

    // ── Category D: Whole Grains & Cereals (5 products, NO price) ──
    {
      name: 'Wheat Grains (Gehun)',
      slug: 'wheat-grains-gehun',
      categorySlug: 'whole-grains-cereals',
      sku: 'KV-GRN-WHEAT',
      shortDescription: 'Premium whole wheat grains (Gehun) sourced directly from Rajasthani farmer guilds. Sun-cured and cleaned. [Price pending admin review]',
      description: 'Sun-dried unpolished whole wheat grains directly from farm fields. High test-weight, cleaned of chaff and stones. Ready for custom chakki milling.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',
      altText: 'Whole Wheat Grains (Gehun)',
      tags: ['wheat grains', 'gehun', 'unpolished grain', 'awaiting-price-review'],
    },
    {
      name: 'Barley Grains (Jau Ki Guli)',
      slug: 'barley-grains-jau-ki-guli',
      categorySlug: 'whole-grains-cereals',
      sku: 'KV-GRN-BARLEY',
      shortDescription: 'High-fiber unhulled Barley Grains (Jau Ki Guli). Renowned for detoxifying and cooling properties in Ayurvedic nutrition. [Price pending admin review]',
      description: 'Traditional wholesome barley grains. An ancient Ayurvedic cooling cereal rich in beta-glucan soluble fiber, beneficial for digestion and metabolic health.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1000&q=80',
      altText: 'Whole Barley Grains (Jau Ki Guli)',
      tags: ['barley', 'jau', 'jau ki guli', 'awaiting-price-review'],
    },
    {
      name: 'Wheat Porridge / Broken Wheat (Gehun Ka Daliya)',
      slug: 'wheat-porridge-broken-wheat-gehun-ka-daliya',
      categorySlug: 'whole-grains-cereals',
      sku: 'KV-GRN-DALIYA',
      shortDescription: 'Coarsely cracked whole wheat porridge (Gehun Ka Daliya). Nutritious, easily digestible, and rich in complex dietary fiber. [Price pending admin review]',
      description: 'Cracked whole grain wheat porridge milled to ideal grain size. Rich in natural bran and germ, wholesome for healthy sweet or savory morning breakfast.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80',
      altText: 'Wheat Porridge / Broken Wheat (Gehun Ka Daliya)',
      tags: ['daliya', 'broken wheat', 'wheat porridge', 'awaiting-price-review'],
    },
    {
      name: 'Pearl Millet Grains (Bajra)',
      slug: 'pearl-millet-grains-bajra',
      categorySlug: 'whole-grains-cereals',
      sku: 'KV-GRN-BAJRA',
      shortDescription: 'Selected organic Pearl Millet Grains (Bajra) from Rajasthan. Nutrient-dense super-grain rich in minerals. [Price pending admin review]',
      description: 'Cleaned, sun-ripened pearl millet whole grains. Rich in iron, phosphorus, and complex carbs. Can be milled fresh or sprouted.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1000&q=80',
      altText: 'Whole Pearl Millet Grains (Bajra)',
      tags: ['bajra grains', 'pearl millet', 'millets', 'awaiting-price-review'],
    },
    {
      name: 'Maize Grains (Makka)',
      slug: 'maize-grains-makka',
      categorySlug: 'whole-grains-cereals',
      sku: 'KV-GRN-MAKKA',
      shortDescription: 'Whole golden Maize Grains (Makka). Naturally sun-dried, chemical-free corn kernels for milling or cooking. [Price pending admin review]',
      description: 'Whole corn kernels sun-dried to optimal moisture content. Hand-sieved and cleaned, free from synthetic preservatives.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1000&q=80',
      altText: 'Whole Maize Grains (Makka)',
      tags: ['makka grains', 'maize', 'corn', 'awaiting-price-review'],
    },

    // ── Category E: Ghee, Honey & Other Products (7 products, NO price) ──
    {
      name: 'Cow Ghee (Gaay Ka Ghee)',
      slug: 'cow-ghee-gaay-ka-ghee',
      matchLegacySlugs: ['a2-gir-cow-vedic-cultured-bilona-ghee'],
      categorySlug: 'ghee-honey-other-products',
      sku: 'KV-GHEE-COW',
      shortDescription: 'Pure Desi Cow Ghee (Gaay Ka Ghee) hand-churned using traditional Vedic Bilona method from curd. Golden, granular texture. [Price pending admin review]',
      description: 'Made from whole indigenous cow milk curd using wooden bilona churning. Simmered on slow cow-dung/wood fire to preserve nutritive butyric acid and sacred golden aroma.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: true,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80',
      altText: 'Pure Desi Cow Bilona Ghee (Gaay Ka Ghee)',
      tags: ['cow ghee', 'gaay ka ghee', 'bilona ghee', 'awaiting-price-review'],
    },
    {
      name: 'Buffalo Ghee (Bhains Ka Ghee)',
      slug: 'buffalo-ghee-bhains-ka-ghee',
      categorySlug: 'ghee-honey-other-products',
      sku: 'KV-GHEE-BUFFALO',
      shortDescription: 'Rich, thick Buffalo Ghee (Bhains Ka Ghee) crafted from pure full-fat buffalo milk curd. Creamy texture and high smoke point. [Price pending admin review]',
      description: 'Traditional white-granular buffalo ghee prepared from pure curd. Naturally high in wholesome milk fats and calcium, preferred for traditional sweets and energetic vigor.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=1000&q=80',
      altText: 'Creamy Buffalo Ghee (Bhains Ka Ghee)',
      tags: ['buffalo ghee', 'bhains ka ghee', 'desi ghee', 'awaiting-price-review'],
    },
    {
      name: 'Small Mustard Honey (Chhoti Makhi Shahad)',
      slug: 'small-mustard-honey-chhoti-makhi-shahad',
      categorySlug: 'ghee-honey-other-products',
      sku: 'KV-HNY-MUSTARD',
      shortDescription: 'Rare, raw Small Bee Mustard Blossom Honey (Chhoti Makhi Shahad) collected from blooming mustard fields. 100% unprocessed. [Price pending admin review]',
      description: 'Harvested from indigenous small wild bees (Apis florea) foraging on flowering yellow mustard blossoms in Rajasthan. Raw, unheated, unfiltered, retaining pollen grains and live enzymes.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: true,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
      altText: 'Raw Small Mustard Honey (Chhoti Makhi Shahad)',
      tags: ['honey', 'chhoti makhi', 'shahad', 'mustard honey', 'awaiting-price-review'],
    },
    {
      name: 'Traditional Desi Jaggery (Desi Gud)',
      slug: 'traditional-desi-jaggery-desi-gud',
      categorySlug: 'ghee-honey-other-products',
      sku: 'KV-OTH-JAGGERY',
      shortDescription: 'Artisanal Chemical-Free Desi Jaggery (Desi Gud) made by slow-simmering organic sugarcane juice. Dark, mineral-rich. [Price pending admin review]',
      description: 'Prepared using ancestral boiling pan techniques without chemical clarifiers, sodium hydrosulphite, or artificial color. Deep brown color rich in bioavailable iron and minerals.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
      altText: 'Traditional Desi Jaggery (Desi Gud)',
      tags: ['jaggery', 'desi gud', 'gur', 'organic gud', 'awaiting-price-review'],
    },
    {
      name: 'Sugar (Khand)',
      slug: 'sugar-khand',
      categorySlug: 'ghee-honey-other-products',
      sku: 'KV-OTH-KHAND',
      shortDescription: 'Traditional Desi Raw Sugar (Khand). Unrefined, naturally crystallized cane sugar that retains vital minerals. [Price pending admin review]',
      description: 'Traditional desi khand made from unrefined cane juice. Free from bone-char bleaching, sulphur, or synthetic chemical refining. Cooling and gentle on digestion.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=1000&q=80',
      altText: 'Traditional Desi Sugar (Khand)',
      tags: ['sugar', 'desi khand', 'unrefined sugar', 'khand', 'awaiting-price-review'],
    },
    {
      name: 'Shakkar',
      slug: 'shakkar',
      categorySlug: 'ghee-honey-other-products',
      sku: 'KV-OTH-SHAKKAR',
      shortDescription: 'Powdered Desi Jaggery (Shakkar) ground from traditional raw jaggery. A healthy daily replacement for white sugar. [Price pending admin review]',
      description: 'Fine golden-brown granulated desi shakkar. Dissolves easily in beverages, hot milk, or sweet dishes while providing natural iron and vitamins.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1000&q=80',
      altText: 'Natural Desi Shakkar',
      tags: ['shakkar', 'desi shakkar', 'jaggery powder', 'awaiting-price-review'],
    },
    {
      name: 'Tea (Chai)',
      slug: 'tea-chai',
      categorySlug: 'ghee-honey-other-products',
      sku: 'KV-OTH-TEA',
      shortDescription: 'Premium strong Indian CTC and Orthodox blend Tea (Chai) leaves. Yields a brisk, deep malt liquor and rich aroma. [Price pending admin review]',
      description: 'Selected hand-plucked tea leaves blended for intense strength, rich color, and invigorating flavor that pairs perfectly with milk, ginger, and cardamom.\n\n*Note: Price & selling unit awaiting owner configuration in Admin Dashboard.*',
      isFeatured: false,
      price: 0,
      unitName: 'Price Pending',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
      altText: 'Premium Indian Tea Leaves (Chai)',
      tags: ['tea', 'chai', 'chai patti', 'ctc tea', 'awaiting-price-review'],
    },

    // ── Category F: Oil Cakes (Khal) (4 products) ──
    {
      name: 'Black Mustard Oil Cake (Kali Sarson Khal)',
      slug: 'black-mustard-oil-cake-kali-sarson-khal',
      categorySlug: 'oil-cakes-khal',
      sku: 'KV-KHL-BLKMUST',
      shortDescription: 'Pure Black Mustard Oil Cake (Kali Sarson Khal) from cold-pressed mustard extraction. Rich cattle feed and organic manure. [Non-edible oil cake]',
      description: 'Concentrated protein meal residue pressed from black mustard seeds. Highly beneficial as a natural cattle nutrition booster to increase milk yield, and as a potent nitrogen-rich soil amendment for organic agriculture.\n\nUnit: Per Kilogram (kg)\nPrice: ₹38 / kg\nUsage: Cattle Feed / Organic Soil Fertilizer\n*Note: This is an oil cake byproduct, not an edible cooking oil.*',
      isFeatured: false,
      price: 3800, // ₹38 per kg
      unitName: '1 kg',
      stock: 500,
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
      altText: 'Pure Black Mustard Oil Cake (Kali Sarson Khal)',
      tags: ['mustard cake', 'sarson khal', 'cattle feed', 'organic fertilizer', 'oil cake'],
    },
    {
      name: 'Groundnut Oil Cake (Moongfali Khal)',
      slug: 'groundnut-oil-cake-moongfali-khal',
      categorySlug: 'oil-cakes-khal',
      sku: 'KV-KHL-GNDNUT',
      shortDescription: 'High-protein Groundnut Oil Cake (Moongfali Khal) from cold-pressing red-skin peanuts. Premium dairy animal feed. [Non-edible oil cake]',
      description: 'Contains high vegetable protein (45%+) and natural residual peanut oils. Highly palatable and digestible fodder for cows and buffaloes.\n\nUnit: Per Kilogram (kg)\nPrice: ₹33 / kg\nUsage: Cattle Feed / Organic Compost\n*Note: This is an oil cake byproduct, not an edible cooking oil.*',
      isFeatured: false,
      price: 3300, // ₹33 per kg
      unitName: '1 kg',
      stock: 450,
      imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=1000&q=80',
      altText: 'Groundnut Oil Cake Meal (Moongfali Khal)',
      tags: ['groundnut cake', 'moongfali khal', 'cattle feed', 'oil cake'],
    },
    {
      name: 'Sesame Oil Cake (Til Khal)',
      slug: 'sesame-oil-cake-til-khal',
      categorySlug: 'oil-cakes-khal',
      sku: 'KV-KHL-SESAME',
      shortDescription: 'Nutrient-packed Sesame Oil Cake (Til Khal) residue from cold-pressed sesame extraction. Rich in methionine and calcium. [Non-edible oil cake]',
      description: 'Extremely rich in minerals, phosphorus, and essential amino acids. An excellent feed supplement for livestock health and vigor.\n\nUnit: Per Kilogram (kg)\nPrice: ₹50 / kg\nUsage: Livestock Nutrition\n*Note: This is an oil cake byproduct, not an edible cooking oil.*',
      isFeatured: false,
      price: 5000, // ₹50 per kg
      unitName: '1 kg',
      stock: 350,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
      altText: 'Sesame Oil Cake (Til Khal)',
      tags: ['sesame cake', 'til khal', 'cattle feed', 'oil cake'],
    },
    {
      name: 'Coconut Oil Cake (Nariyal Khal)',
      slug: 'coconut-oil-cake-nariyal-khal',
      categorySlug: 'oil-cakes-khal',
      sku: 'KV-KHL-COCONUT',
      shortDescription: 'Natural dried Coconut Oil Cake (Nariyal Khal / Copra Meal). Highly digestible fiber and energy source for livestock. [Non-edible oil cake]',
      description: 'Copra meal resulting from wood-pressed coconut oil extraction. High in fiber and moderate energy, promoting healthy rumination in dairy cattle.\n\nUnit: Per Kilogram (kg)\nPrice: ₹45 / kg\nUsage: Livestock Nutrition / Horticulture\n*Note: This is an oil cake byproduct, not an edible cooking oil.*',
      isFeatured: false,
      price: 4500, // ₹45 per kg
      unitName: '1 kg',
      stock: 300,
      imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80',
      altText: 'Coconut Oil Cake / Copra Meal (Nariyal Khal)',
      tags: ['coconut cake', 'nariyal khal', 'copra meal', 'oil cake'],
    },
  ];

  console.log(`\n📦 Importing ${productCatalogue.length} Products across 6 Categories...`);

  const activeSlugs = new Set();

  for (let i = 0; i < productCatalogue.length; i++) {
    const item = productCatalogue[i];
    activeSlugs.add(item.slug);

    const categoryId = categoryMap[item.categorySlug];
    if (!categoryId) {
      console.error(`Missing category for slug: ${item.categorySlug}`);
      continue;
    }

    // Check if an existing product exists with this slug or a legacy slug
    let existing = await prisma.product.findUnique({
      where: { slug: item.slug },
      include: { variants: true, images: true },
    });

    if (!existing && item.matchLegacySlugs && item.matchLegacySlugs.length > 0) {
      for (const legacySlug of item.matchLegacySlugs) {
        existing = await prisma.product.findUnique({
          where: { slug: legacySlug },
          include: { variants: true, images: true },
        });
        if (existing) {
          console.log(`  Linking legacy product "${existing.slug}" -> "${item.slug}"`);
          break;
        }
      }
    }

    const productData = {
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      shortDescription: item.shortDescription,
      description: item.description,
      categoryId,
      status: 'PUBLISHED',
      isFeatured: !!item.isFeatured,
      taxRate: 5,
      tags: JSON.stringify(item.tags || []),
    };

    let product;
    if (existing) {
      product = await prisma.product.update({
        where: { id: existing.id },
        data: productData,
      });
      console.log(`  [${i + 1}/${productCatalogue.length}] Updated: ${product.name}`);
    } else {
      product = await prisma.product.create({
        data: productData,
      });
      console.log(`  [${i + 1}/${productCatalogue.length}] Created: ${product.name}`);
    }

    // Upsert Default Variant
    const variantSku = `${item.sku}-${item.unitName.replace(/\s+/g, '').toUpperCase()}`;
    const existingVariant = await prisma.productVariant.findFirst({
      where: { productId: product.id },
      orderBy: { isDefault: 'desc' },
    });

    if (existingVariant) {
      await prisma.productVariant.update({
        where: { id: existingVariant.id },
        data: {
          name: item.unitName,
          sku: variantSku,
          price: item.price,
          compareAtPrice: item.price > 0 ? Math.round(item.price * 1.15) : null,
          stock: item.stock,
          isDefault: true,
        },
      });
    } else {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: item.unitName,
          sku: variantSku,
          price: item.price,
          compareAtPrice: item.price > 0 ? Math.round(item.price * 1.15) : null,
          stock: item.stock,
          isDefault: true,
          sortOrder: 0,
        },
      });
    }

    // Set Image
    const existingImg = await prisma.productImage.findFirst({
      where: { productId: product.id },
    });

    if (existingImg) {
      await prisma.productImage.update({
        where: { id: existingImg.id },
        data: {
          url: item.imageUrl,
          altText: item.altText,
        },
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: item.imageUrl,
          altText: item.altText,
          sortOrder: 0,
        },
      });
    }
  }

  // ─── 3. Archive Any Old Demo Products Not in the 33 Catalogue ──────────────
  const oldProducts = await prisma.product.findMany({
    where: {
      slug: { notIn: Array.from(activeSlugs) },
      status: { not: 'ARCHIVED' },
    },
  });

  if (oldProducts.length > 0) {
    console.log(`\nArchiving ${oldProducts.length} old demo products not in active price list...`);
    for (const p of oldProducts) {
      await prisma.product.update({
        where: { id: p.id },
        data: { status: 'ARCHIVED' },
      });
      console.log(`  Archived: ${p.name} (${p.slug})`);
    }
  }

  // ─── 4. Update Store Address in Settings ─────────────────────────────────────
  const correctAddress = '71A, Vasant Vihar, Near Ring Road, Vatika Road, Jaipur, Rajasthan - 302022, India';
  await prisma.storeSetting.upsert({
    where: { key: 'store_address' },
    update: { value: correctAddress },
    create: { key: 'store_address', value: correctAddress },
  });
  await prisma.storeSetting.upsert({
    where: { key: 'mill_address' },
    update: { value: correctAddress },
    create: { key: 'mill_address', value: correctAddress },
  });
  console.log(`\n✓ Store address updated to: ${correctAddress}`);

  // ─── 5. Catalogue Verification Summary ───────────────────────────────────────
  const publishedCount = await prisma.product.count({ where: { status: 'PUBLISHED' } });
  const totalCategories = await prisma.category.count();
  const pricedCount = await prisma.productVariant.count({
    where: {
      price: { gt: 0 },
      product: { status: 'PUBLISHED' },
    },
  });
  const unpricedCount = await prisma.productVariant.count({
    where: {
      price: 0,
      product: { status: 'PUBLISHED' },
    },
  });

  console.log('\n=========================================');
  console.log('🎉 CATALOGUE MIGRATION COMPLETED SUCCESSFULLY!');
  console.log(`Total Published Products: ${publishedCount} (Target: 33)`);
  console.log(`Total Active Categories: ${totalCategories} (Target: 6)`);
  console.log(`Products with Confirmed Prices: ${pricedCount} (Target: 21)`);
  console.log(`Products Pending Price Review: ${unpricedCount} (Target: 12)`);
  console.log('=========================================\n');

  await prisma.$disconnect();
}

run().catch((e) => {
  console.error('Fatal error running catalogue population:', e);
  process.exit(1);
});
