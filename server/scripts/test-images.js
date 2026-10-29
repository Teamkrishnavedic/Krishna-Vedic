const https = require('https');
const http = require('http');

const images = {
  // Categories
  cat_oils: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
  cat_flour: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
  cat_spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
  cat_grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',
  cat_ghee_honey: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80',
  cat_oil_cakes: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',

  // Category A: Cold-Pressed Oils (8)
  black_mustard_oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
  yellow_mustard_oil: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1000&q=80',
  groundnut_oil: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80', // peanuts / oil
  groundnut_oil_alt: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=1000&q=80',
  sesame_oil: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
  coconut_oil: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80',
  almond_oil: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=80',
  castor_oil: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80',
  flaxseed_oil: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1000&q=80',

  // Category B: Flour (Atta) (4)
  wheat_flour: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
  bajra_flour: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80',
  maize_flour: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1000&q=80',
  multigrain_flour: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',

  // Category C: Spices & Masalas (5)
  coriander: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1000&q=80',
  turmeric_powder: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1000&q=80',
  red_chilli: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
  red_chilli_alt: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1000&q=80',
  whole_spices: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80',
  ground_garam_masala: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1000&q=80',

  // Category D: Whole Grains & Cereals (5)
  wheat_grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',
  barley_grains: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1000&q=80',
  wheat_porridge_daliya: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80',
  pearl_millet_grains: 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1000&q=80',
  maize_grains: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1000&q=80',

  // Category E: Ghee, Honey & Other Products (7)
  cow_ghee: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80',
  buffalo_ghee: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=1000&q=80',
  small_mustard_honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
  desi_jaggery: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
  sugar_khand: 'https://images.unsplash.com/photo-1581447109200-bf276912b64b?auto=format&fit=crop&w=1000&q=80',
  desi_shakkar: 'https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1000&q=80',
  tea_chai: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',

  // Category F: Oil Cakes (Khal) (4)
  black_mustard_oil_cake: 'https://images.unsplash.com/photo-1596040033282-475269f88c52?auto=format&fit=crop&w=1000&q=80',
  groundnut_oil_cake: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=1000&q=80',
  sesame_oil_cake: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
  coconut_oil_cake: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80',
};

function checkUrl(key, url) {
  return new Promise((resolve) => {
    https.get(url, { method: 'HEAD' }, (res) => {
      resolve({ key, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
    }).on('error', (e) => {
      resolve({ key, status: 0, ok: false, error: e.message });
    });
  });
}

async function run() {
  console.log(`Checking ${Object.keys(images).length} image URLs...`);
  const results = await Promise.all(Object.entries(images).map(([k, u]) => checkUrl(k, u)));
  let failed = 0;
  for (const r of results) {
    if (!r.ok) {
      console.log(`❌ ${r.key}: status ${r.status}`);
      failed++;
    } else {
      console.log(`✓ ${r.key}: ${r.status}`);
    }
  }
  console.log(`Done. ${results.length - failed}/${results.length} URLs passed.`);
}

run();
