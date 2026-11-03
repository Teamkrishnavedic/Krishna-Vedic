import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, AlertCircle, Clock, CheckCircle2, Phone, CreditCard, HeartHandshake } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

export default function ReturnsPage() {
  const { supportPhone, supportEmail, millAddress, brandName, fssaiNumber } = useStoreSettings();

  return (
    <div className="max-w-5xl mx-auto px-gutter-mobile md:px-margin py-12 md:py-16">
      {/* Header */}
      <div className="mb-12 text-center space-y-3 border-b border-outline-variant/30 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-semibold uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5" />
          Consumer Assurance &amp; Food Safety Standards
        </div>
        <h1 className="font-headline-lg text-headline-lg md:text-4xl text-primary font-serif">
          Returns, Replacement &amp; Refund Policy
        </h1>
        <p className="text-on-surface-variant text-sm max-w-2xl mx-auto">
          We stand unconditionally behind the artisan purity, lab-verified quality, and transit safety of every bottle we seal.
        </p>
        <p className="text-outline text-xs">
          Compliant with Consumer Protection (E-Commerce) Rules, 2020 &amp; FSSAI Regulations • Updated November 2026
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">100% Free Replacement</h3>
          <p className="text-xs text-on-surface-variant">
            If your parcel arrives broken, leaking, or damaged during courier transit, we dispatch a fresh bottle immediately at zero cost.
          </p>
        </div>
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">48-Hour Reporting</h3>
          <p className="text-xs text-on-surface-variant">
            Simply send a photo or unboxing video to our WhatsApp concierge within 48 hours of doorstep delivery.
          </p>
        </div>
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">5–7 Day Bank Refund</h3>
          <p className="text-xs text-on-surface-variant">
            Approved refunds are credited directly back to your source account (UPI, Card, or NEFT) within 5 to 7 business days.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-surface-container-lowest p-6 sm:p-10 border border-outline-variant/30 rounded-xl space-y-10 text-on-surface-variant text-sm leading-relaxed shadow-xs">
        
        {/* Section 1: Food Safety & Hygiene */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            1. Perishable Food Safety &amp; Sealed Bottle Rule
          </h2>
          <p>
            Because Krishna Vedic extracts 100% raw, unrefined cold-pressed oils, pure A2 desi cow bilona ghee, and stone-ground spices meant for human consumption, all consignments are governed by strict <strong>Food Safety and Standards Authority of India (FSSAI)</strong> health and hygiene protocols:
          </p>
          <div className="p-4 bg-surface-container-low rounded-md border-l-4 border-primary text-xs space-y-2">
            <p>
              • <strong>Tamper-Evident Seals:</strong> Every bottle and packet is hermetically sealed with an induction safety seal at our mill.
            </p>
            <p>
              • <strong>Opened Product Rule:</strong> Once the outer safety seal or bottle cap has been opened, broken, or tampered with, the product <strong>cannot be physically returned</strong> for safety, hygiene, and cross-contamination prevention reasons.
            </p>
            <p>
              • <strong>Unopened Returns:</strong> If you wish to return an unopened bottle in its original intact seal and packaging, you may initiate a return request within <strong>7 days of delivery</strong>.
            </p>
          </div>
        </section>

        {/* Section 2: Eligible Scenarios */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <RotateCcw className="w-5 h-5 text-secondary" />
            2. Scenarios Covered Under 100% Free Replacement or Refund
          </h2>
          <p>
            You are fully protected and eligible for an instant free replacement or complete refund under any of the following circumstances:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span><strong>Transit Damage or Breakage:</strong> The outer amber glass bottle arrives cracked, shattered, or severely chipped.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span><strong>Bottle Leakage / Compromised Seal:</strong> Oil has leaked in transit or the inner tamper-evident foil seal arrived punctured.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span><strong>Incorrect Item Delivered:</strong> The package received contains a different oil or spice variant from what was billed on your invoice.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span><strong>Expired Product:</strong> The product received is past its best-before date (we guarantee a minimum 6–9 months fresh shelf life upon delivery).</span>
            </div>
          </div>
        </section>

        {/* Section 3: Simple 3-Step Claim Process */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <Clock className="w-5 h-5 text-secondary" />
            3. How to Submit a Claim (Simple 3-Step Process)
          </h2>
          <p className="text-xs">
            In accordance with Rule 5 of the Consumer Protection (E-Commerce) Rules, 2020, our claims process is swift and hassle-free:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant/30 text-xs">
              <span className="font-bold text-primary text-sm block mb-1">Step 1: Photograph</span>
              <p className="text-on-surface-variant">
                Take 2 to 3 clear photos or a short unboxing video highlighting the broken bottle, leaking cap, or incorrect product label alongside the shipping label.
              </p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant/30 text-xs">
              <span className="font-bold text-primary text-sm block mb-1">Step 2: Message Support</span>
              <p className="text-on-surface-variant">
                Send the photos and your Order Number to our WhatsApp Concierge at <strong>{supportPhone}</strong> or email <strong>{supportEmail}</strong> within <strong>48 hours of delivery</strong>.
              </p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant/30 text-xs">
              <span className="font-bold text-primary text-sm block mb-1">Step 3: Rapid Resolution</span>
              <p className="text-on-surface-variant">
                Our mill concierge will review and verify your request within 4 business hours, and dispatch a fresh replacement or issue your refund immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Refund Disbursement Timelines */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <CreditCard className="w-5 h-5 text-secondary" />
            4. Refund Disbursement Timelines &amp; Settlement Modes
          </h2>
          <p className="text-xs">
            Once a refund is approved by our team, it is initiated through our RBI-licensed payment gateway partner (Razorpay) or direct banking transfer:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-xs text-on-surface">
            <li>
              <strong>Prepaid Orders (UPI / Debit &amp; Credit Cards / NetBanking):</strong> The full invoice amount is reversed directly to your original payment source. Depending on your bank&apos;s settlement schedule, funds reflect in your account within <strong>5 to 7 business days</strong>.
            </li>
            <li>
              <strong>Cash on Delivery (COD) Orders:</strong> Because cash cannot be handed over via post, our support team will request your preferred <strong>UPI ID (VPA)</strong> or <strong>Bank Account Details (Account Number + IFSC)</strong> and initiate an instant NEFT / UPI transfer within 24 to 48 hours.
            </li>
            <li>
              <strong>Cancellation Prior to Dispatch:</strong> If you cancel an order before the courier AWB is generated, 100% of the payment is refunded immediately with zero cancellation deductions.
            </li>
          </ul>
        </section>

        {/* Section 5: Non-Returnable Situations */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <AlertCircle className="w-5 h-5 text-secondary" />
            5. Non-Returnable &amp; Ineligible Conditions
          </h2>
          <div className="p-4 bg-surface-container-low rounded-md border border-outline-variant/30 text-xs space-y-1.5">
            <p>• Returns requested after more than 7 days from physical delivery.</p>
            <p>• Consignments reported damaged more than 48 hours after courier delivery confirmation.</p>
            <p>• Bottles where the inner induction seal has been broken or removed.</p>
            <p>• Inherent hallmarks of authentic wood-pressing (such as natural amber color variance, seed sedimentation at the bottom, or seasonal seed pungency) do not constitute defects.</p>
          </div>
        </section>

        {/* Section 6: Support Helpdesk */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20 bg-surface-container-low p-6 rounded-lg border border-outline-variant/30">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
            <Phone className="w-5 h-5 text-secondary" />
            6. Dedicated Concierge &amp; Claims Desk
          </h2>
          <p className="text-xs">
            Our team in Jaipur is available Monday through Saturday (9:00 AM to 7:00 PM IST) to assist with any product queries or claims:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <p className="font-bold text-on-surface">Registered Mill Facility:</p>
              <p className="text-on-surface-variant">{millAddress}</p>
              <p className="font-bold text-on-surface mt-2">FSSAI License:</p>
              <p className="text-on-surface-variant">{fssaiNumber}</p>
            </div>
            <div>
              <p className="font-bold text-on-surface">WhatsApp Claims Concierge:</p>
              <p>
                <a href={`tel:${supportPhone}`} className="text-secondary underline font-semibold">
                  {supportPhone}
                </a>
              </p>
              <p className="font-bold text-on-surface mt-2">Claims Email:</p>
              <p>
                <a href={`mailto:${supportEmail}`} className="text-secondary underline font-semibold">
                  {supportEmail}
                </a>
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Footer Navigation Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-on-surface-variant border-t border-outline-variant/30 pt-6">
        <div className="flex gap-4">
          <Link to="/shipping" className="hover:text-primary underline">Shipping Policy</Link>
          <Link to="/privacy" className="hover:text-primary underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary underline">Terms &amp; Conditions</Link>
          <Link to="/contact" className="hover:text-primary underline">Contact Grievance Desk</Link>
        </div>
        <div>
          Governed by Indian Law • Consumer Protection Rules, 2020
        </div>
      </div>
    </div>
  );
}
