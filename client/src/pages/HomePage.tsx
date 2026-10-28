import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

/* ─── Reusable animation helpers ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, ease: 'easeOut', delay },
  }),
};

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated Counter ────────────────────────────────────────────────── */
function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(to / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, to]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Category image fallbacks ────────────────────────────────────────── */
const getCategoryFallbackImage = (slug: string) => {
  if (slug.includes('oil') || slug.includes('ghani'))
    return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80';
  if (slug.includes('ground') || slug.includes('powder') || slug.includes('turmeric'))
    return 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80';
  if (slug.includes('masala') || slug.includes('blend') || slug.includes('spice'))
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
  if (slug.includes('ghee'))
    return 'https://images.unsplash.com/photo-1631632259158-58c7e73fef64?auto=format&fit=crop&w=800&q=80';
  if (slug.includes('honey'))
    return 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80';
  return 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80';
};

/* ═══════════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: bestsellersData, isLoading: isBestsellersLoading } = useQuery({
    queryKey: ['home-bestsellers'],
    queryFn: async () => {
      const res = await api.get('/products/bestsellers?limit=4');
      return res.data;
    },
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['home-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const handleAddToCart = async (variantId: string, quantity: number) => {
    try {
      await addItem(variantId, quantity);
      toast({ title: 'Added to basket', description: 'Item added to your shopping cart', variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || err.message, variant: 'error' });
    }
  };

  const bestsellers = bestsellersData?.products || [];
  const categories = (categoriesData?.categories || [])
    .filter((c: any) => c._count?.products > 0 || !c.parentId)
    .slice(0, 4);

  /* ── Parallax hero scroll ─────────────────────────────────────────── */
  const heroImgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#fafbf5] text-[#2d2a26] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <div ref={heroImgRef} className="absolute inset-0 will-change-transform scale-110">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=90"
              alt="Traditional Indian oil press — Bel Kohlu"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-12 py-24 md:py-28">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200">
                Jaipur Heritage Mill · Since 1940s
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
            >
              सात पीढ़ियों की
              <br />
              <span className="italic font-normal text-amber-300">विरासत</span>
            </motion.h1>

            {/* English Sub-title */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.35}
              className="mt-3 font-serif text-xl sm:text-2xl text-white/70 italic"
            >
              Seven Generations of Heritage
            </motion.p>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="mt-6 text-sm sm:text-base text-white/75 max-w-lg leading-relaxed font-light"
            >
              Our great-grandparents began this journey in the 1940s — pressing oil the
              traditional <em>Kachi Ghani</em> way, with bulls turning the stone Bel Kohlu.
              Today, we carry that same sacred process to your kitchen.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.65}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/shop"
                className="group bg-[#6e3418] text-white px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-[#8b4b2d] transition-all shadow-lg hover:shadow-amber-900/30 active:scale-95 flex items-center gap-2"
              >
                <span>Shop the Pantry</span>
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
              <Link
                to="/about"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-white/20 transition-all active:scale-95"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — TRUST PILLARS (always-visible on scroll)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#3f674f] py-4 px-4 border-b border-[#2d4d3a] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: 'eco', label: '100% Wood-Pressed', sub: 'Below 38°C · No heat' },
            { icon: 'verified', label: 'Zero Chemicals', sub: 'No refining · No additives' },
            { icon: 'grain', label: 'Stone-Ground Spices', sub: 'Natural stone chakki' },
            { icon: 'local_shipping', label: 'Pan-India Delivery', sub: 'Food-grade packaging' },
          ].map((p, i) => (
            <AnimatedSection key={p.label} delay={i * 0.1} className="flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg text-amber-300">{p.icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">{p.label}</p>
                <p className="text-[11px] text-white/60 mt-0.5">{p.sub}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — THE FAMILY LEGACY STORY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 px-5 sm:px-8 md:px-12 bg-[#fafbf5]">
        <div className="max-w-7xl mx-auto">
          {/* Section label */}
          <AnimatedSection className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6e3418] font-bold">
              Our Legacy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2d2a26] mt-3 leading-tight">
              A Story Pressed in Time
            </h2>
            <div className="mt-4 flex justify-center">
              <div className="h-px w-20 bg-[#6e3418]/30" />
            </div>
          </AnimatedSection>

          {/* Timeline items */}
          <div className="space-y-20 md:space-y-0 md:grid md:grid-cols-3 md:gap-12 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-[#6e3418]/30 to-transparent" />

            {[
              {
                decade: '1940s',
                title: 'दादा-दादी का सपना',
                titleEn: 'The Founding Dream',
                body: 'Our great-grandparents set up the first Bel Kohlu — a massive stone oil press turned by bulls — in a small courtyard in Jaipur. Every drop of oil carried their sweat, faith, and the promise of purity.',
                icon: '🐂',
                img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
              },
              {
                decade: '1970s',
                title: 'परंपरा की निरंतरता',
                titleEn: 'The Tradition Continues',
                body: 'The next generation grew up watching the bulls circle the kohlu at dawn. They learned that slow rotation — just 14 RPM — keeps the oil cool, fragrant, and alive with nutrients that factory machines destroy.',
                icon: '🌿',
                img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
              },
              {
                decade: 'Today',
                title: 'आपके घर तक',
                titleEn: 'From Our Mill to Your Kitchen',
                body: 'We honour every ancestor who tended this mill by bringing the same authentic Kachi Ghani oil, stone-ground spices, and pure A2 ghee — to homes all across India, unchanged in method, uncompromised in quality.',
                icon: '🏡',
                img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
              },
            ].map((item, i) => (
              <AnimatedSection key={item.decade} delay={i * 0.15} className="flex flex-col items-center text-center">
                {/* Circle with icon */}
                <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-4 border-[#fafbf5] shadow-xl mb-6 bg-[#f4f4ec]">
                  <img src={item.img} alt={item.titleEn} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                </div>

                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#6e3418]/10 text-[#6e3418] mb-3">
                  {item.decade}
                </span>
                <h3 className="font-serif text-lg text-[#2d2a26] font-bold">{item.title}</h3>
                <p className="text-xs text-[#6e3418] italic mb-3">{item.titleEn}</p>
                <p className="text-sm text-[#53433d] leading-relaxed font-light max-w-xs mx-auto">
                  {item.body}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — THE KOHLU PROCESS (full-width editorial)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-0 bg-[#2d2a26] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
          {/* Left: Image */}
          <AnimatedSection className="relative overflow-hidden min-h-[320px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=85"
              alt="Traditional bull-driven kohlu oil press"
              className="w-full h-full object-cover opacity-80"
            />
            {/* Orange tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6e3418]/40 to-transparent" />
          </AnimatedSection>

          {/* Right: Story */}
          <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16 space-y-7">
            <AnimatedSection delay={0.1}>
              <span className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold">
                The Kachi Ghani Method
              </span>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="font-serif text-3xl sm:text-4xl text-white leading-tight">
                Bel Kohlu — the ancient
                <br />
                <span className="italic text-amber-300">art of honest oil.</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p className="text-sm text-white/70 leading-relaxed font-light">
                A bull walks slow circles around a massive wooden press — the Bel Kohlu. The
                stone mortar turns at just <strong className="text-white">14 RPM</strong>,
                gently coaxing oil from the seed without a single degree of artificial heat.
                Temperature never exceeds <strong className="text-white">38°C</strong>.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <p className="text-sm text-white/70 leading-relaxed font-light">
                Compare that to industrial expellers spinning at{' '}
                <strong className="text-white">1,200 RPM</strong> and generating over
                100°C — destroying vitamins, killing aroma, and stripping the very soul
                of the seed. Our ancestors refused that shortcut. So do we.
              </p>
            </AnimatedSection>

            {/* Process steps */}
            <AnimatedSection delay={0.5}>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { label: 'Bulls turn Kohlu', icon: '🐂' },
                  { label: 'Stone cold-presses', icon: '⚙️' },
                  { label: 'Pure oil filters', icon: '🫙' },
                ].map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-xl mb-2">
                      {step.icon}
                    </div>
                    <p className="text-[11px] text-white/60 leading-tight">{step.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — ANIMATED STATS STRIP
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-14 px-5 bg-[#6e3418] overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { to: 3, suffix: '+', label: 'Generations of Craft' },
            { to: 80, suffix: '+', label: 'Years of Legacy' },
            { to: 0, suffix: '', label: 'Chemicals. Ever.' },
            { to: 100, suffix: '%', label: 'Pure & Authentic' },
          ].map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1} className="flex flex-col items-center gap-1">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-amber-300">
                <AnimatedCounter to={stat.to} suffix={stat.suffix} />
              </span>
              <span className="text-xs text-white/70 uppercase tracking-wider">{stat.label}</span>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6 — SHOP BY CATEGORY (Dynamic from DB)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 px-5 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <AnimatedSection className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6e3418] font-bold">
              Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2d2a26]">
              Explore Our Pantry
            </h2>
            <p className="text-sm text-[#7d7567] max-w-md mx-auto leading-relaxed">
              Every seed, spice, and drop of ghee — ethically sourced and processed
              with the same patience as our ancestors.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isCategoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl bg-[#f4f4ec] animate-pulse" />
              ))
            ) : (
              categories.map((cat: any, i: number) => (
                <AnimatedSection key={cat.id} delay={i * 0.1}>
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="group relative block aspect-[3/4] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={cat.imageUrl || getCategoryFallbackImage(cat.slug)}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    {/* Label */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <p className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                        {cat.name}
                      </p>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        {cat._count?.products || 0} Products
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Explore</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7 — BESTSELLERS (Dynamic from DB)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 px-5 sm:px-8 md:px-12 bg-[#f4f4ec]/50 border-t border-b border-[#e5e2da]">
        <div className="max-w-7xl mx-auto space-y-12">
          <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#6e3418] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#6e3418] animate-pulse" />
                Highest-Selling Essentials
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2d2a26]">
                Pantry Bestsellers
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold uppercase tracking-wider text-[#3f674f] hover:text-[#2d4d3a] flex items-center gap-1 group"
            >
              <span>View All Products</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </AnimatedSection>

          {isBestsellersLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl bg-[#f4f4ec] animate-pulse" />
              ))}
            </div>
          ) : bestsellers.length === 0 ? (
            <p className="py-16 text-center text-[#7d7567] font-serif">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestsellers.map((product: any, i: number) => (
                <AnimatedSection key={product.id} delay={i * 0.1}>
                  <ProductCard
                    product={product}
                    onAddToCart={(variantId, qty) => handleAddToCart(variantId, qty)}
                  />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8 — HERITAGE LETTER FROM THE FAMILY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 px-5 sm:px-8 md:px-12 bg-[#fafbf5]">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="relative bg-[#2d2a26] rounded-3xl overflow-hidden shadow-2xl">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=60"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 p-8 sm:p-12 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Quote Mark */}
              <div className="lg:col-span-1 hidden lg:flex justify-center">
                <span className="font-serif text-8xl text-[#6e3418]/40 leading-none select-none">"</span>
              </div>

              {/* Letter */}
              <div className="lg:col-span-8 space-y-5">
                <span className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold">
                  A Letter from Our Family
                </span>

                <p className="font-serif text-lg sm:text-xl text-white leading-relaxed">
                  "When our great-grandparents pressed the first batch of oil, there were no
                  labs, no certifications, no e-commerce. There was only one standard —
                  <span className="italic text-amber-300"> would you give this to your own children?</span>
                </p>

                <p className="text-sm text-white/70 leading-relaxed font-light">
                  That question has guided every batch we have ever pressed. We did not
                  switch to machines when the world did. We did not add preservatives when
                  shelf-life demanded it. We simply kept asking the same question our
                  great-grandparents asked — and the answer was always the same.
                </p>

                <p className="text-sm text-white/70 leading-relaxed font-light">
                  Today you hold the result of that answer in your hands. Pure. Honest.
                  Unchanged. This is not just oil — it is our family's word, pressed fresh
                  for your family.
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#6e3418] flex items-center justify-center text-white font-serif font-bold text-lg">
                    K
                  </div>
                  <div>
                    <p className="font-serif text-white text-sm font-semibold">
                      The Krishnavedic Family
                    </p>
                    <p className="text-[11px] text-white/50">Jaipur Heritage Mill · Est. 1940s</p>
                  </div>
                </div>
              </div>

              {/* Side image on large screens */}
              <div className="lg:col-span-3 hidden lg:block">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1631632259158-58c7e73fef64?auto=format&fit=crop&w=600&q=80"
                    alt="Authentic ghee in traditional copper vessel"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9 — CUSTOMER TESTIMONIALS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-24 px-5 sm:px-8 md:px-12 bg-[#f4f4ec]/60 border-t border-[#e5e2da]">
        <div className="max-w-7xl mx-auto space-y-12">
          <AnimatedSection className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6e3418] font-bold">
              Community Love
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2d2a26]">
              Trusted Across Bharat
            </h2>
            <p className="text-xs text-[#7d7567] leading-relaxed">
              Real reviews from home cooks and food lovers who value pure, honest ingredients.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stars: 5,
                quote:
                  'The aroma of their Kachi Ghani Mustard Oil took me straight back to my childhood in Rajasthan. The authentic pungency is unmatched by any supermarket brand.',
                name: 'Priya Sharma',
                place: 'Jaipur, Rajasthan',
              },
              {
                stars: 5,
                quote:
                  'Their stone-ground turmeric and biryani blend transformed our weekend family dinners. You can literally smell the freshness the moment you open the lid.',
                name: 'Rajesh Menon',
                place: 'Bengaluru, Karnataka',
              },
              {
                stars: 5,
                quote:
                  'Finding genuine wood-pressed sesame oil delivered safely in food-grade packaging is a blessing. It has become a permanent staple in our home.',
                name: 'Dr. Ananya Sen',
                place: 'New Delhi',
              },
            ].map((review, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className="bg-[#fafbf5] p-7 sm:p-8 rounded-3xl border border-[#e5e2da] shadow-sm flex flex-col justify-between space-y-5 h-full">
                  <div className="space-y-4">
                    <div className="flex gap-0.5 text-[#6e3418] text-sm">
                      {'★'.repeat(review.stars)}
                    </div>
                    <p className="text-sm text-[#53433d] leading-relaxed italic font-serif">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#e5e2da] flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs text-[#2d2a26]">{review.name}</p>
                      <p className="text-[11px] text-[#7d7567]">{review.place}</p>
                    </div>
                    <span className="material-symbols-outlined text-base text-[#3f674f]">
                      verified
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 10 — NEWSLETTER CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 px-5 sm:px-8 md:px-12 bg-[#fafbf5]">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto bg-[#3f674f] text-[#fafbf5] rounded-3xl p-8 md:p-14 text-center space-y-6 shadow-xl overflow-hidden relative">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-white/5" />

            <span className="relative text-xs uppercase tracking-[0.2em] text-[#a5d1b3] font-bold">
              The Krishnavedic Circle
            </span>
            <h2 className="relative font-serif text-3xl sm:text-4xl">
              Pure Harvest Updates to Your Inbox
            </h2>
            <p className="relative text-sm text-[#fafbf5]/75 max-w-md mx-auto leading-relaxed font-light">
              Receive early access to seasonal fresh-press batches, festive spice blends,
              and authentic traditional recipes from our family kitchen.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast({
                  title: 'Welcome to the Circle',
                  description: 'You have subscribed to harvest dispatches.',
                  variant: 'success',
                });
              }}
              className="relative flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="bg-[#fafbf5] text-[#2d2a26] px-5 py-3.5 rounded-full text-xs focus:outline-none flex-grow placeholder:text-[#7d7567]"
              />
              <button
                type="submit"
                className="bg-[#6e3418] text-[#fafbf5] px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#8b4b2d] transition-colors whitespace-nowrap cursor-pointer shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </AnimatedSection>
      </section>

      {/* Bottom spacer for mobile nav */}
      <div className="h-16 md:h-0 block md:hidden" />
    </div>
  );
}
