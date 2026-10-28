import React from 'react';
import { Link } from 'react-router-dom';

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile md:px-margin py-14">
      <div className="mb-10 text-center space-y-2 border-b border-outline-variant/30 pb-6">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          Fulfillment &amp; Transit
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-on-surface-variant text-xs mt-1">
          Everything you need to know about how your cold-press lots are packed and shipped across Bharat.
        </p>
      </div>

      <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed">
        <div className="bg-surface-container-low p-6 border border-outline-variant/30 space-y-2">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">schedule</span>
            1. Fresh Milling &amp; Dispatch Timeline
          </h2>
          <p>
            Because we bottle oils in small batches straight from the wood-press vats, all in-stock orders are leak-proof sealed with food-grade inner seals and dispatched from our Jaipur mill facility within <strong>24 to 48 hours</strong> of order placement.
          </p>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant/30 space-y-2">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">local_shipping</span>
            2. Delivery Timelines Across Bharat
          </h2>
          <ul className="space-y-1.5 mt-2 list-none">
            <li>• <strong>Delhi NCR, Rajasthan &amp; Northern States:</strong> 2 to 4 business days.</li>
            <li>• <strong>Mumbai, Gujarat &amp; Western States:</strong> 3 to 5 business days.</li>
            <li>• <strong>Bengaluru, Hyderabad, Chennai &amp; Southern States:</strong> 4 to 6 business days.</li>
            <li>• <strong>Eastern &amp; North-Eastern States:</strong> 5 to 7 business days.</li>
          </ul>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant/30 space-y-2">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">verified</span>
            3. Shipping Tariffs &amp; Free Delivery
          </h2>
          <p>
            We offer <strong>Free Standard Shipping</strong> on all domestic orders of <strong>₹799 and above</strong>. For orders below ₹799, a flat shipping charge of ₹79 is applied to cover our heavy UV-amber glass bottle packaging and biodegradable rice-husk shock cushioning.
          </p>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant/30 space-y-2">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">share_location</span>
            4. Live Consignment Tracking
          </h2>
          <p>
            Once your consignment is handed over to our verified national courier partners (BlueDart, Delhivery, DTDC), you will receive a dispatch SMS and WhatsApp message with your live AWB tracking link. You can also monitor delivery status directly in your <Link to="/account/orders" className="text-secondary underline font-semibold">Account Dashboard</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
