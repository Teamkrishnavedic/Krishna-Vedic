import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function HomePage() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      const res = await api.get('/products?limit=8');
      return res.data;
    },
  });

  const handleAddToCart = async (variantId: string, quantity: number) => {
    try {
      await addItem(variantId, quantity);
      toast({
        title: 'Added to basket',
        description: 'Item added to your shopping cart',
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || err.message,
        variant: 'error',
      });
    }
  };

  const products = productsData?.products || [];

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Top Notification & Ethos Ticker */}
      <section className="w-full bg-surface-container-high py-2.5 px-gutter-mobile md:px-margin border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-on-surface-variant font-label-md text-label-md uppercase tracking-widest text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-secondary" />
            <span>Rabi Harvest 2026: Fresh Wood-Press Extraction In Progress</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">science</span>
              NABL Assayed Batches
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">local_shipping</span>
              Dispatched within 24 Hours
            </span>
          </div>
        </div>
      </section>

      {/* 1. Immersive Editorial Hero */}
      <section className="relative w-full bg-surface-container-low overflow-hidden py-12 md:py-20 px-gutter-mobile md:px-margin border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Typographic Narrative (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2">
              <span className="bg-[#3f674f] text-[#fafbf5] font-label-sm text-xs uppercase px-3 py-1 rounded-full tracking-widest font-semibold">
                Traditional Bull-Ghani &amp; Wood-Press
              </span>
              <span className="text-[#7d7567] font-label-md text-xs uppercase tracking-wider">
                Harvest Lot #KV-2026
              </span>
            </div>

            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface leading-tight font-serif">
              Rooted in Tradition.<br />
              <span className="italic font-normal text-primary">Made for Every Kitchen.</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Authentic bull-driven wood ghani oils and stone-pounded Indian spices, thoughtfully brought to your table. Extracted below 38°C in ancestral Albizia lebbeck wood to preserve natural aroma, uncompromised pungency, and vital phytonutrients.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="bg-secondary text-on-secondary font-label-lg text-label-lg uppercase px-8 py-3.5 rounded-full tracking-wider hover:bg-primary transition-all flex items-center gap-2 cursor-pointer font-semibold shadow-md active:scale-95"
              >
                <span>Explore Ghani Oils &amp; Spices</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link
                to="/about"
                className="bg-transparent text-primary border border-primary font-label-lg text-label-lg uppercase px-7 py-3.5 rounded-full tracking-wider hover:bg-primary hover:text-on-primary transition-colors font-semibold"
              >
                Our Heritage &amp; Guilds
              </Link>
            </div>

            {/* Metric Badges Strip with smooth curves */}
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg">
              <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between border border-outline-variant/30 shadow-xs">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">100%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1 font-medium">
                  Wood-Pressed Ghani
                </span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between border border-outline-variant/30 shadow-xs">
                <span className="font-headline-sm text-headline-sm text-secondary font-bold">0%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1 font-medium">
                  Chemical Solvents
                </span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between border border-outline-variant/30 shadow-xs">
                <span className="font-headline-sm text-headline-sm text-tertiary font-bold">Direct</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1 font-medium">
                  Jaipur Farmer Mandis
                </span>
              </div>
            </div>
          </div>

          {/* Hero Visual Composition (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-[4/5] bg-surface-container-highest overflow-hidden rounded-3xl border border-outline-variant/40 shadow-lg">
              <img
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                alt="Artisanal glass bottle of golden amber cold pressed mustard oil"
                src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              {/* Editorial Stamped Overlay Badges with smooth curved corners */}
              <div className="absolute top-4 left-4 bg-surface/95 backdrop-blur-sm p-3.5 max-w-[210px] rounded-2xl border border-outline-variant/40 shadow-sm">
                <span className="font-label-sm text-xs text-primary uppercase block tracking-widest font-bold">
                  Heritage Spec
                </span>
                <span className="font-title-lg text-title-lg text-on-surface font-serif">
                  Kachi Ghani
                </span>
                <span className="font-body-sm text-xs text-on-surface-variant block mt-0.5 font-medium">
                  Slow Mara Chekku Extraction
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-primary text-on-primary p-3.5 text-right rounded-2xl border border-outline-variant/40 shadow-sm">
                <span className="font-label-sm text-xs uppercase tracking-widest text-primary-fixed block font-bold">
                  Tested Lot
                </span>
                <span className="font-headline-sm text-headline-sm block font-serif">
                  100% Mara Chekku
                </span>
                <span className="font-body-sm text-xs text-on-primary-container">
                  Raw &amp; Unadulterated
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop-by-Category Grid (4 Tactile Photo Blocks) */}
      <section className="w-full py-16 md:py-24 px-gutter-mobile md:px-margin bg-surface">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1 font-bold">
                Culinary Pillars
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-serif">
                Explore By Category
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Every raw seed is harvested in peak season, gently cleaned by hand, and processed without adulterants, artificial bleaching, or preservatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1: Cold Pressed Oils */}
            <div className="bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/30 rounded-3xl overflow-hidden hover:shadow-md group">
              <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container-high relative border-b border-outline-variant/30 rounded-t-3xl">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Cold pressed oils"
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 bg-surface/95 backdrop-blur-xs text-on-surface font-label-sm text-xs uppercase px-3 py-1 font-semibold border border-outline-variant/30 rounded-full">
                  01 • Bull Ghani Oils
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-serif">
                    Wood-Pressed Oils
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Slow-extracted below 38°C in ancestral wood chakkis to keep live enzymes and raw aroma intact.
                  </p>
                </div>
                <Link
                  to="/shop/cold-pressed-oils"
                  className="mt-6 inline-flex items-center justify-between text-primary font-label-lg text-xs uppercase tracking-wider hover:text-secondary font-semibold bg-surface-container-lowest py-2 px-4 rounded-full border border-outline-variant/30 group-hover:border-primary transition-colors"
                >
                  <span>View Oils (7)</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Category 2: Single-Origin Powders */}
            <div className="bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/30 rounded-3xl overflow-hidden hover:shadow-md group">
              <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container-high relative border-b border-outline-variant/30 rounded-t-3xl">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Salem turmeric powder"
                  src="https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 bg-surface/95 backdrop-blur-xs text-on-surface font-label-sm text-xs uppercase px-3 py-1 font-semibold border border-outline-variant/30 rounded-full">
                  02 • Stone Spices
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-serif">
                    Stone-Ground Spices
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Stone-ground at low revolutions to prevent thermal degradation and preserve volatile essential oils.
                  </p>
                </div>
                <Link
                  to="/shop/ground-spices"
                  className="mt-6 inline-flex items-center justify-between text-primary font-label-lg text-xs uppercase tracking-wider hover:text-secondary font-semibold bg-surface-container-lowest py-2 px-4 rounded-full border border-outline-variant/30 group-hover:border-primary transition-colors"
                >
                  <span>View Spices (9)</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Category 3: Whole Sun-Dried Spices */}
            <div className="bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/30 rounded-3xl overflow-hidden hover:shadow-md group">
              <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container-high relative border-b border-outline-variant/30 rounded-t-3xl">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Whole dried spices"
                  src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 bg-surface/95 backdrop-blur-xs text-on-surface font-label-sm text-xs uppercase px-3 py-1 font-semibold border border-outline-variant/30 rounded-full">
                  03 • Whole Spices
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-serif">
                    Sun-Dried Whole Spices
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Hand-sorted pods, seeds, and barks sun-cured on terracotta terraces under Rajasthan and Malabar skies.
                  </p>
                </div>
                <Link
                  to="/shop/whole-spices"
                  className="mt-6 inline-flex items-center justify-between text-primary font-label-lg text-xs uppercase tracking-wider hover:text-secondary font-semibold bg-surface-container-lowest py-2 px-4 rounded-full border border-outline-variant/30 group-hover:border-primary transition-colors"
                >
                  <span>View Whole (3)</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Category 4: Traditional Masala Blends */}
            <div className="bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/30 rounded-3xl overflow-hidden hover:shadow-md group">
              <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container-high relative border-b border-outline-variant/30 rounded-t-3xl">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Aromatic spice blends"
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 bg-surface/95 backdrop-blur-xs text-on-surface font-label-sm text-xs uppercase px-3 py-1 font-semibold border border-outline-variant/30 rounded-full">
                  04 • Heritage Masalas
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-serif">
                    Handmade Masala Blends
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Ancestral royal recipes: roasted over gentle wood embers and pounded by hand in stone vats.
                  </p>
                </div>
                <Link
                  to="/shop/masala-blends"
                  className="mt-6 inline-flex items-center justify-between text-primary font-label-lg text-xs uppercase tracking-wider hover:text-secondary font-semibold bg-surface-container-lowest py-2 px-4 rounded-full border border-outline-variant/30 group-hover:border-primary transition-colors"
                >
                  <span>View Blends (5)</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bestsellers & Kitchen Essentials */}
      <section className="w-full py-16 md:py-24 px-gutter-mobile md:px-margin bg-surface-container-low border-t border-outline-variant/30" id="catalogue">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold block mb-1">
                Pantry Foundations
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-serif">
                Bestsellers &amp; Kitchen Essentials
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/shop"
                className="bg-primary text-on-primary font-label-md text-xs uppercase px-5 py-2.5 rounded-full tracking-wider font-semibold shadow-xs"
              >
                All Harvest Lots
              </Link>
              <Link
                to="/shop/cold-pressed-oils"
                className="bg-surface-container-lowest text-on-surface-variant font-label-md text-xs uppercase px-5 py-2.5 rounded-full tracking-wider hover:bg-surface-container-high transition-colors border border-outline-variant/30"
              >
                Ghani Oils
              </Link>
              <Link
                to="/shop/ground-spices"
                className="bg-surface-container-lowest text-on-surface-variant font-label-md text-xs uppercase px-5 py-2.5 rounded-full tracking-wider hover:bg-surface-container-high transition-colors border border-outline-variant/30"
              >
                Stone-Pounded
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-on-surface-variant font-serif text-lg border border-outline-variant/30 bg-surface-container-lowest rounded-2xl">
              Retrieving small-batch harvest logs...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(variantId, qty) => handleAddToCart(variantId, qty)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Brand Heritage: Master Extraction & Milling Register */}
      <section className="w-full py-16 md:py-24 px-gutter-mobile md:px-margin bg-surface border-t border-outline-variant/30" id="heritage-ethos">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="max-w-3xl space-y-3">
            <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold">
              The Krishnavedic Code
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-serif">
              Master Extraction &amp; Milling Protocol
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Industrial solvent expellers rotate at 1200 RPM and exceed 120°C, scorching natural polyphenols.
              Our ancestral Mara Chekku presses rotate at 14 RPM below 38°C, retaining the complete nutritional matrix.
            </p>
          </div>

          {/* Detailed Two-Column Protocol Register */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Milling Methodologies */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-lg text-title-lg text-primary font-serif">
                    1. Wood-Pressed Mara Chekku
                  </h3>
                  <span className="font-label-sm text-xs uppercase text-secondary font-bold bg-secondary-container/40 px-2.5 py-1 rounded-full">
                    Raw Cold Extraction
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Crafted using dense seasoned Vagai (Albizia lebbeck) wood mortars. Wood naturally absorbs mechanical friction heat, preventing seed oxidation and protecting delicate oleic fatty acids.
                </p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-lg text-title-lg text-primary font-serif">
                    2. Slow Stone Chakki Pulverization
                  </h3>
                  <span className="font-label-sm text-xs uppercase text-secondary font-bold bg-secondary-container/40 px-2.5 py-1 rounded-full">
                    Low-RPM Milling
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Natural grade-A granite stones slowly pulverize sun-dried whole spices without thermal charring. This locks in the natural volatile aromatic oils (such as curcuma and piperine) lost in industrial pulverizers.
                </p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-lg text-title-lg text-primary font-serif">
                    3. Natural Cloth Settling
                  </h3>
                  <span className="font-label-sm text-xs uppercase text-secondary font-bold bg-secondary-container/40 px-2.5 py-1 rounded-full">
                    Zero Chemicals
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  We never use chemical bleaching clays or hexane solvents. Freshly pressed oils settle naturally in food-grade steel vats for 72 hours before being gravity-filtered through fine woven muslin cloth.
                </p>
              </div>
            </div>

            {/* Right: Technical Specification Register Table */}
            <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/40 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="border-b border-outline-variant/30 pb-3 flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  Quality Assurance Ledger
                </span>
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Batch Lot Assay Standards
                </span>
              </div>

              <table className="w-full text-left font-body-sm text-body-sm">
                <tbody className="divide-y divide-outline-variant/20">
                  <tr>
                    <td className="py-2.5 text-on-surface-variant font-medium">Mortar RPM</td>
                    <td className="py-2.5 text-primary font-bold text-right">12 to 14 RPM max</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-on-surface-variant font-medium">Extraction Temperature</td>
                    <td className="py-2.5 text-secondary font-bold text-right">Strictly below 38°C</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-on-surface-variant font-medium">Free Fatty Acids (FFA)</td>
                    <td className="py-2.5 text-primary font-bold text-right">&lt; 0.8% (Acid Value &lt; 1.6)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-on-surface-variant font-medium">Moisture Content</td>
                    <td className="py-2.5 text-secondary font-bold text-right">&lt; 0.15% by weight</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-on-surface-variant font-medium">Hexane &amp; Argemone</td>
                    <td className="py-2.5 text-secondary font-bold text-right">0.00% (Not Detected)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-on-surface-variant font-medium">Container Material</td>
                    <td className="py-2.5 text-primary font-bold text-right">Amber UV Glass &amp; Food Tin</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-on-surface-variant font-medium">Lab Accreditation</td>
                    <td className="py-2.5 text-primary font-bold text-right">NABL / FSSAI Certified</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider hover:text-primary transition-colors block text-center border border-secondary/40 py-2"
                >
                  Inspect Complete Provenance Records &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Seasonal Recipe / Culinary Journal */}
      <section className="w-full py-16 md:py-24 px-gutter-mobile md:px-margin bg-surface-container-low border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary block mb-1 font-bold">
                Pantry In Action
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-serif">
                The Heritage Kitchen Journal
              </h2>
            </div>
            <Link
              to="/about"
              className="font-label-lg text-label-lg text-primary uppercase tracking-wider hover:text-secondary flex items-center gap-1 font-semibold"
            >
              <span>Read All Folios</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Recipe Spotlight */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-10 rounded-3xl flex flex-col justify-between border border-outline-variant/30 space-y-8 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-primary-container text-on-primary font-label-sm text-xs uppercase px-3 py-1 rounded-full tracking-wider font-semibold">
                    Heritage Recipe
                  </span>
                  <span className="font-label-sm text-xs text-outline uppercase tracking-wider font-medium">
                    15 Minutes • Serves 4
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-serif">
                  The Art of the Royal Tadka: Golden Mustard &amp; Curry Leaf Tempering
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  When authentic kachi ghani mustard oil reaches its gentle smoke point, it blooms raw black mustard seeds with a nutty, crackling intensity that industrial refined oils simply cannot achieve.
                </p>
              </div>

              {/* Recipe Ingredients Strip */}
              <div className="bg-surface-container-low p-5 rounded-2xl space-y-3 border border-outline-variant/30">
                <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold block">
                  Required Pantry Essentials
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-surface-container-lowest p-3.5 rounded-xl flex flex-col justify-between border border-outline-variant/20 shadow-xs">
                    <div>
                      <span className="font-label-sm text-sm font-semibold text-on-surface block">Mustard Oil</span>
                      <span className="font-body-sm text-xs text-outline">1 Litre Bottle</span>
                    </div>
                    <span className="font-label-md text-sm font-bold text-primary mt-2">₹345</span>
                  </div>
                  <div className="bg-surface-container-lowest p-3.5 rounded-xl flex flex-col justify-between border border-outline-variant/20 shadow-xs">
                    <div>
                      <span className="font-label-sm text-sm font-semibold text-on-surface block">Salem Haldi</span>
                      <span className="font-body-sm text-xs text-outline">250g Tin</span>
                    </div>
                    <span className="font-label-md text-sm font-bold text-primary mt-2">₹185</span>
                  </div>
                  <div className="bg-surface-container-lowest p-3.5 rounded-xl flex flex-col justify-between border border-outline-variant/20 shadow-xs">
                    <div>
                      <span className="font-label-sm text-sm font-semibold text-on-surface block">Byadagi Chilli</span>
                      <span className="font-body-sm text-xs text-outline">250g Pouch</span>
                    </div>
                    <span className="font-label-md text-sm font-bold text-primary mt-2">₹220</span>
                  </div>
                </div>
                <Link
                  to="/shop"
                  className="w-full bg-secondary text-on-secondary py-3 rounded-full font-label-md text-xs uppercase tracking-wider hover:bg-primary transition-colors flex items-center justify-center gap-2 mt-2 font-semibold shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">shopping_bag</span>
                  <span>View All 3 Essentials</span>
                </Link>
              </div>
            </div>

            {/* Secondary Journal Notes */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 flex flex-col justify-between flex-grow space-y-4 shadow-sm">
                <div className="space-y-2">
                  <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
                    Culinary Note
                  </span>
                  <h4 className="font-title-lg text-title-lg text-on-surface font-serif">
                    Why Unrefined Gingelly Oil Transforms Traditional Rasam
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    The heat tolerance of cold-pressed gingelly balanced with native palm jaggery stabilizes gastric heat during winter temperings.
                  </p>
                </div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1 font-label-md text-xs text-primary uppercase tracking-wider hover:text-secondary font-semibold"
                >
                  <span>Read Article</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 flex flex-col justify-between flex-grow space-y-4 shadow-sm">
                <div className="space-y-2">
                  <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                    Field Dispatch
                  </span>
                  <h4 className="font-title-lg text-title-lg text-on-surface font-serif">
                    Curcumin Percentage in Raw Salem Turmeric Rhizomes
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Polished market haldi is chemically boiled and depleted. Natural sun-curing preserves up to 5.2% natural curcuma volatile oils.
                  </p>
                </div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1 font-label-md text-xs text-primary uppercase tracking-wider hover:text-secondary font-semibold"
                >
                  <span>Read Dispatch</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Harvest Transparency & Newsletter Register */}
      <section className="w-full py-16 px-gutter-mobile md:px-margin bg-surface border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Horizontal Traceability Banner */}
          <div className="bg-surface-container-low p-6 md:p-8 rounded-3xl border border-outline-variant/30 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-primary mt-0.5">qr_code_scanner</span>
              <div className="space-y-1">
                <h4 className="font-title-lg text-title-lg text-on-surface font-serif">Batch QR Scan</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Every glass bottle carries a QR code directing to its unique NABL purity assay and moisture certificate.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-secondary mt-0.5">inventory_2</span>
              <div className="space-y-1">
                <h4 className="font-title-lg text-title-lg text-on-surface font-serif">Zero-Plastic Delivery</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Shipped in heavy amber UV-shield glass bottles and recyclable food-grade tin canisters with rice husk packing.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-tertiary mt-0.5">verified</span>
              <div className="space-y-1">
                <h4 className="font-title-lg text-title-lg text-on-surface font-serif">Purity Guarantee</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Zero mineral oils, argemone adulterants, artificial color stabilizers, or chemical bleaching agents.
                </p>
              </div>
            </div>
          </div>

          {/* Harvest Subscription Box */}
          <div className="bg-primary text-on-primary p-8 md:p-12 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 border border-outline-variant/40 shadow-xl">
            <div className="space-y-2 max-w-xl text-center lg:text-left">
              <span className="font-label-sm text-xs uppercase tracking-widest text-primary-fixed block font-bold">
                The Heritage Kitchen Circle
              </span>
              <h3 className="font-headline-md text-headline-md text-on-primary font-serif">
                Receive First Press Harvest Dispatches
              </h3>
              <p className="font-body-md text-body-md text-on-primary-container">
                Subscribers receive advance notifications before seasonal cold-press batches are bottled, along with rare regional spice pairings.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast({
                  title: 'Folio Registered',
                  description: 'You are now subscribed to seasonal harvest dispatches.',
                  variant: 'success',
                });
              }}
              className="w-full lg:max-w-md flex flex-col sm:flex-row gap-2"
            >
              <input
                className="w-full bg-surface-container-lowest text-on-surface px-5 py-3 rounded-full font-body-sm text-body-sm focus:outline-none placeholder:text-outline border border-outline-variant/40"
                placeholder="Enter your email address"
                required
                type="email"
              />
              <button
                className="bg-secondary text-on-secondary px-7 py-3 rounded-full font-label-lg text-xs uppercase tracking-wider hover:bg-surface-container-highest hover:text-primary transition-colors whitespace-nowrap font-semibold cursor-pointer shadow-md"
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
