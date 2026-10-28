import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="w-full bg-surface">
      {/* Hero Section */}
      <section className="py-20 bg-secondary text-on-secondary px-gutter-mobile md:px-margin border-b border-outline-variant/30">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="font-label-md text-label-md uppercase tracking-widest text-tertiary-fixed font-bold block">
            Ancestral Mill Heritage
          </span>
          <h1 className="font-headline-lg text-headline-lg font-serif text-on-secondary leading-tight">
            Reviving Sacred Vedic Nutrition for the Modern Indian Kitchen
          </h1>
          <p className="font-body-md text-body-md text-on-secondary/90 max-w-2xl mx-auto leading-relaxed">
            At Krishnavedic Oil &amp; Masalas, our mission is to resurrect time-tested wooden Mara Chekku and granite chakki extraction, delivering pure, unadulterated vitality direct from our regional farmer guilds.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-gutter-mobile md:px-margin bg-surface border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold">
              The Origin Story
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-serif">
              The Industrialization of Oil and Our Return to the Ghani
            </h2>
            <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed font-body-md">
              <p>
                Over the past forty years, industrial expellers running above 120°C and chemical solvent extraction stripped Indian cooking oils of their live enzymes, natural tocopherols, and pungent volatile aromatics. Supermarket shelves became dominated by bleached, hexane-refined blends.
              </p>
              <p>
                Krishnavedic was founded to return to authentic craft milling. We revived traditional <em>Mara Chekku</em> vats made from seasoned Albizia lebbeck (Vagai) wood, rotating slowly at 14 RPM to ensure seed temperatures never exceed 38°C.
              </p>
              <p>
                No synthetic anti-foaming agents. No chemical deodorization. No artificial color dyes. Just pure single-origin seeds harvested ethically by our partner collectives across Rajasthan, Karnataka, and Tamil Nadu.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-outline-variant/40 bg-surface-container-high overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1000&q=80"
                alt="Traditional Wood Pressing"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section: Technical Purity Register */}
      <section className="py-20 px-gutter-mobile md:px-margin bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
              Provenance Protocols
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-serif">
              The Four Vedic Quality Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 border border-outline-variant/30 text-left space-y-3">
              <span className="material-symbols-outlined text-3xl text-primary">hourglass_bottom</span>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">
                1. Wood-Pressed Ghani
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Extracted in seasoned Vagai wooden mortars at 14 RPM below 38°C to retain all natural polyphenols and enzymes.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 border border-outline-variant/30 text-left space-y-3">
              <span className="material-symbols-outlined text-3xl text-secondary">agriculture</span>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">
                2. Direct Farmer Mandis
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Ethically procured black mustard from Bharatpur, Salem turmeric from Tamil Nadu, and Byadagi chillies from Karnataka.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 border border-outline-variant/30 text-left space-y-3">
              <span className="material-symbols-outlined text-3xl text-primary">grain</span>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">
                3. Slow Stone Chakki
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Whole spices pulverized on slow granite millstones to preserve essential volatile aromatics without thermal scorching.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 border border-outline-variant/30 text-left space-y-3">
              <span className="material-symbols-outlined text-3xl text-secondary">verified</span>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">
                4. NABL Lab Assayed
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Every bottle carries batch QR verification displaying free fatty acid index, peroxide value, and zero adulterant assay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-gutter-mobile md:px-margin bg-primary text-on-primary text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="font-headline-lg text-headline-lg font-serif">
            Experience Real Cold-Pressed Purity
          </h2>
          <p className="text-sm text-on-primary-container leading-relaxed">
            Bring home authentic small-batch oils and stone-ground spices freshly pressed and packaged in recyclable amber glass.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-block bg-secondary text-on-secondary px-8 py-3.5 font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-surface-container-highest hover:text-primary transition-colors cursor-pointer"
            >
              Explore Harvest Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
