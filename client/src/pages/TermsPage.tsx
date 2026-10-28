import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile md:px-margin py-14">
      <div className="mb-10 text-center space-y-2 border-b border-outline-variant/30 pb-6">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          Statutory Compliance
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">
          Terms &amp; Conditions of Service
        </h1>
        <p className="text-on-surface-variant text-xs mt-1">
          Consumer Protection (E-Commerce) Rules, 2020 : Last Updated October 2026
        </p>
      </div>

      <div className="bg-surface-container-low p-8 border border-outline-variant/30 space-y-6 text-on-surface-variant text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">contract</span>
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or purchasing from Krishnavedic Oil &amp; Masalas, you agree to be bound by these Terms and Conditions and our associated delivery and returns policies.
          </p>
        </section>

        <section className="pt-4 border-t border-outline-variant/20">
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">spa</span>
            2. Products &amp; Natural Variations
          </h2>
          <p>
            Our products are 100% natural, traditional wood-pressed oils and stone-ground spices. Because they are raw and unrefined without synthetic homogenizers, natural variations in golden amber hue, seed sedimentation, and seasonal pungency are inherent hallmarks of authentic single-origin harvests.
          </p>
        </section>

        <section className="pt-4 border-t border-outline-variant/20">
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">receipt_long</span>
            3. Pricing &amp; Order Acceptance
          </h2>
          <p>
            All prices listed on the store are denominated in Indian Rupees (INR) and inclusive of statutory GST. We reserve the right to modify pricing, cancel duplicate orders, or decline orders arising from clerical errors.
          </p>
        </section>

        <section className="pt-4 border-t border-outline-variant/20">
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">account_balance</span>
            4. Governing Law &amp; Jurisdiction
          </h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or proceeding arising under these terms shall be subject to the exclusive jurisdiction of the competent courts of Jaipur, Rajasthan.
          </p>
        </section>
      </div>
    </div>
  );
}
