import React from 'react';
import { Link } from 'react-router-dom';
import { STORE_CONFIG } from '@/lib/storeConfig';

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile md:px-margin py-14">
      <div className="mb-10 text-center space-y-2 border-b border-outline-variant/30 pb-6">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          Consumer Assurance
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">
          Returns &amp; Replacement Policy
        </h1>
        <p className="text-on-surface-variant text-xs mt-1">
          We stand unconditionally behind the artisan purity and safety of every harvest lot we bottle.
        </p>
      </div>

      <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed">
        <div className="bg-surface-container-low p-6 border border-outline-variant/30 space-y-2">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">inventory_2</span>
            1. Perishable Food Safety Regulations
          </h2>
          <p>
            Due to strict FSSAI food safety and hygiene protocols governing edible oils and culinary spices, opened or unsealed glass bottles cannot be physically returned once the tamper-evident seal is broken. However, if your order arrives broken, leaking, or compromised, we issue a <strong>100% Free Replacement or Immediate Full Refund</strong>.
          </p>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant/30 space-y-2">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">report</span>
            2. Reporting Transit Breakage or Defect
          </h2>
          <p>
            Please report any glass breakage, leak, or incorrect item delivery within <strong>48 hours of courier delivery</strong> by writing to <a href={`mailto:${STORE_CONFIG.email}`} className="text-secondary underline font-semibold">{STORE_CONFIG.email}</a> or messaging our WhatsApp concierge at {STORE_CONFIG.phone} along with a photo of the shipment box and invoice number.
          </p>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant/30 space-y-2">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">payments</span>
            3. Refund Disbursement Timelines
          </h2>
          <p>
            Approved refunds are initiated immediately to your original payment method (Bank Account, UPI, or Card) and typically reflect in your statement within <strong>3 to 5 business days</strong> according to your bank's clearance schedule. For Cash on Delivery orders, refunds are credited directly via instant UPI or NEFT.
          </p>
        </div>
      </div>
    </div>
  );
}
