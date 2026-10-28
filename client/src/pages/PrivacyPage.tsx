import React from 'react';
import { STORE_CONFIG } from '@/lib/storeConfig';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile md:px-margin py-14">
      <div className="mb-10 text-center space-y-2 border-b border-outline-variant/30 pb-6">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          Digital Data Protection
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">
          Privacy Policy
        </h1>
        <p className="text-on-surface-variant text-xs mt-1">
          Compliant with the Digital Personal Data Protection Act (DPDP), 2023 : Last Updated October 2026
        </p>
      </div>

      <div className="bg-surface-container-low p-8 border border-outline-variant/30 space-y-6 text-on-surface-variant text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">verified_user</span>
            1. Information We Collect
          </h2>
          <p>
            When you purchase products or register an account with Krishnavedic Oil &amp; Masalas, we collect personal information strictly necessary to fulfill your dispatch, including your name, email address, mobile number, delivery address, and payment confirmation tokens.
          </p>
        </section>

        <section className="pt-4 border-t border-outline-variant/20">
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">security</span>
            2. How We Utilize Your Data
          </h2>
          <p>
            Your information is used strictly to process orders, dispatch SMS and WhatsApp AWB transit updates, authenticate your user session, and issue mandatory FSSAI invoices. We never sell, rent, or trade your personal data to third-party advertising brokers.
          </p>
        </section>

        <section className="pt-4 border-t border-outline-variant/20">
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">lock</span>
            3. Payment Security &amp; Encryption
          </h2>
          <p>
            All online financial transactions are securely processed through RBI-approved, PCI-DSS Level 1 certified payment gateways (Razorpay). Krishnavedic does not store or process your credit card numbers, CVVs, or net banking passwords on our servers.
          </p>
        </section>

        <section className="pt-4 border-t border-outline-variant/20">
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">cookie</span>
            4. Session Storage &amp; Cookies
          </h2>
          <p>
            We use strictly essential session cookies to remember items in your shopping basket and keep you authenticated during your session. You may manage or disable cookies via your browser settings at any time.
          </p>
        </section>

        <section className="pt-4 border-t border-outline-variant/20">
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">gavel</span>
            5. Grievance Officer
          </h2>
          <p>
            In accordance with Information Technology Rules, 2021, the contact details of the Grievance Officer are: Data Protection Desk, Krishnavedic Heritage Foods Pvt Ltd, Jaipur, Rajasthan. Email: {STORE_CONFIG.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
