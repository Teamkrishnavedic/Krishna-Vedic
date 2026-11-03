import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, ShieldCheck, MapPin, PackageCheck, AlertCircle, Phone } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

export default function ShippingPage() {
  const { supportPhone, supportEmail, millAddress, brandName } = useStoreSettings();

  return (
    <div className="max-w-5xl mx-auto px-gutter-mobile md:px-margin py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-12 text-center space-y-3 border-b border-outline-variant/30 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5" />
          Pan-Bharat Delivery Network
        </div>
        <h1 className="font-headline-lg text-headline-lg md:text-4xl text-primary font-serif">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-on-surface-variant text-sm max-w-2xl mx-auto">
          How our fresh, wood-pressed cold batches and stone-ground spices are safely bottled, cushioned, and dispatched across Bharat.
        </p>
        <p className="text-outline text-xs">
          Compliant with Consumer Protection (E-Commerce) Rules, 2020 • Last Updated: November 2026
        </p>
      </div>

      {/* Quick Overview Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">24–48 Hr Dispatch</h3>
          <p className="text-xs text-on-surface-variant">
            Freshly pressed lots are bottled, sealed, and handed over to courier within 24 to 48 business hours.
          </p>
        </div>
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">Glass Shock Cushion</h3>
          <p className="text-xs text-on-surface-variant">
            Heavy UV-amber glass bottles packed with five-ply corrugated cartons and rice-husk honeycomb protection.
          </p>
        </div>
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <PackageCheck className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">Free Delivery ₹799+</h3>
          <p className="text-xs text-on-surface-variant">
            Enjoy complimentary door delivery on all prepaid and COD orders of ₹799 and above.
          </p>
        </div>
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">Live SMS &amp; WhatsApp AWB</h3>
          <p className="text-xs text-on-surface-variant">
            Direct tracking notifications sent to your Indian mobile number as soon as the consignment moves.
          </p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="bg-surface-container-lowest p-6 sm:p-10 border border-outline-variant/30 rounded-xl space-y-10 text-on-surface-variant text-sm leading-relaxed shadow-xs">
        
        {/* Section 1: Fresh Milling & Dispatch */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <Clock className="w-5 h-5 text-secondary" />
            1. Fresh Milling &amp; Dispatch Timeline
          </h2>
          <p>
            Unlike supermarket brands holding industrialized inventories in warehouses for months, {brandName} extracts oil using slow cold-press wood vats (kachi ghani) in small, unheated batches.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-on-surface">
            <li>
              <strong>Standard Orders:</strong> Dispatched from our central mill facility in Jaipur, Rajasthan within <strong>24 to 48 hours</strong> of payment confirmation or COD verification.
            </li>
            <li>
              <strong>Sunday &amp; National Holiday Milling:</strong> Orders received on Sundays or gazetted public holidays are queued and dispatched on the immediate following business day.
            </li>
          </ul>
        </section>

        {/* Section 2: Pan-Bharat Delivery Timelines */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <Truck className="w-5 h-5 text-secondary" />
            2. Estimated Transit Timelines Across Bharat
          </h2>
          <p>
            We partner with premier Indian express couriers (BlueDart, Delhivery, DTDC, Xpressbees, and India Post for remote postal zones) to guarantee swift, dependable transit:
          </p>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs border border-outline-variant/30 rounded-md overflow-hidden">
              <thead className="bg-surface-container font-serif text-primary">
                <tr>
                  <th className="p-3 border-b border-outline-variant/30 font-semibold">Region / Zone</th>
                  <th className="p-3 border-b border-outline-variant/30 font-semibold">Covered States &amp; Cities</th>
                  <th className="p-3 border-b border-outline-variant/30 font-semibold">Estimated Delivery Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                <tr>
                  <td className="p-3 font-medium text-on-surface">Rajasthan &amp; Delhi NCR</td>
                  <td className="p-3">Jaipur, Delhi, Gurgaon, Noida, Jodhpur, Udaipur, Kota</td>
                  <td className="p-3 font-semibold text-primary">2 to 3 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-on-surface">Northern States</td>
                  <td className="p-3">Punjab, Haryana, Uttar Pradesh, Uttarakhand, Himachal Pradesh</td>
                  <td className="p-3 font-semibold text-primary">3 to 4 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-on-surface">Western &amp; Central Bharat</td>
                  <td className="p-3">Maharashtra (Mumbai, Pune), Gujarat (Ahmedabad, Surat), Madhya Pradesh</td>
                  <td className="p-3 font-semibold text-primary">3 to 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-on-surface">Southern States</td>
                  <td className="p-3">Karnataka (Bengaluru), Telangana (Hyderabad), Tamil Nadu (Chennai), Kerala</td>
                  <td className="p-3 font-semibold text-primary">4 to 6 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-on-surface">Eastern &amp; North-Eastern States</td>
                  <td className="p-3">West Bengal (Kolkata), Bihar, Odisha, Assam, Meghalaya, Sikkim, Tripura</td>
                  <td className="p-3 font-semibold text-primary">5 to 7 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-on-surface">Island &amp; Remote Mountain UTs</td>
                  <td className="p-3">Jammu &amp; Kashmir, Ladakh, Andaman &amp; Nicobar Islands</td>
                  <td className="p-3 font-semibold text-primary">6 to 8 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Shipping Charges */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <PackageCheck className="w-5 h-5 text-secondary" />
            3. Shipping Tariffs &amp; Free Delivery Threshold
          </h2>
          <div className="space-y-2 text-xs">
            <p>
              • <strong>Free Delivery on Orders ₹799 and Above:</strong> All domestic orders with an aggregate cart value of ₹799 or more qualify for <strong>100% Free Express Shipping</strong> anywhere across India.
            </p>
            <p>
              • <strong>Standard Shipping Fee for Orders Below ₹799:</strong> A nominal flat charge of <strong>₹79</strong> is applied to orders below ₹799. This covers the cost of heavy UV-filtering amber glass containers, vacuum seals, and specialized biodegradable shock packaging.
            </p>
            <p>
              • <strong>Zero Hidden Fees:</strong> What you see at checkout is final. There are no octroi surprises, handling fees, or unannounced postal surcharges.
            </p>
          </div>
        </section>

        {/* Section 4: AWB Tracking */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            4. Live Tracking Notifications &amp; Delivery Attempts
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-on-surface">
            <li>
              <strong>Instant AWB Link:</strong> As soon as your lot is scanned by the courier, you will receive a dispatch SMS and WhatsApp message with your tracking Air Waybill (AWB) number.
            </li>
            <li>
              <strong>Direct Account Tracking:</strong> You can also monitor your package milestone-by-milestone inside your <Link to="/account/orders" className="text-secondary underline font-semibold">Account Orders Dashboard</Link>.
            </li>
            <li>
              <strong>Three Delivery Attempts:</strong> The courier executive will make up to three attempts to deliver your package to your nominated address. An OTP or signature may be required upon physical handover.
            </li>
            <li>
              <strong>Incorrect Address Policy:</strong> Please verify your 6-digit PIN code and mobile number before placing your order. In the event of an undeliverable address provided by the customer, re-shipping charges may apply after package return.
            </li>
          </ul>
        </section>

        {/* Section 5: Packaging & Breakage Assurance */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <AlertCircle className="w-5 h-5 text-secondary" />
            5. Heavy Glass Packaging &amp; Transit Breakage Protection
          </h2>
          <p className="text-xs">
            We reject plastic bottles for edible oils due to microplastic leaching and phthalate migration. Instead, we use premium food-grade amber glass bottles with induction-sealed leak-proof caps.
          </p>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-md text-xs text-on-surface">
            <strong>100% Transit Breakage Guarantee:</strong> If in the rare event your glass bottle is broken, leaked, or damaged during courier transit, do not worry. Simply photograph the parcel within 48 hours and we will dispatch a <strong>free immediate replacement</strong> or initiate a full refund. See our <Link to="/returns" className="text-secondary underline font-semibold">Returns &amp; Replacement Policy</Link> for details.
          </div>
        </section>

        {/* Section 6: Support Contact */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20 bg-surface-container-low p-6 rounded-lg border border-outline-variant/30">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
            <Phone className="w-5 h-5 text-secondary" />
            6. Shipping Inquiries &amp; Delivery Support
          </h2>
          <p className="text-xs">
            For urgent dispatch inquiries, address corrections before shipping, or courier escalation:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <p className="font-bold text-on-surface">Mill Dispatch Facility:</p>
              <p className="text-on-surface-variant">{millAddress}</p>
            </div>
            <div>
              <p className="font-bold text-on-surface">WhatsApp Courier Concierge:</p>
              <p>
                <a href={`tel:${supportPhone}`} className="text-secondary underline font-semibold">
                  {supportPhone}
                </a>
              </p>
              <p className="font-bold text-on-surface mt-2">Email Desk:</p>
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
          <Link to="/returns" className="hover:text-primary underline">Returns &amp; Refunds</Link>
          <Link to="/privacy" className="hover:text-primary underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary underline">Terms &amp; Conditions</Link>
          <Link to="/contact" className="hover:text-primary underline">Contact Mill</Link>
        </div>
        <div>
          FSSAI Lic. Verified • Jaipur Mill Dispatch
        </div>
      </div>
    </div>
  );
}
