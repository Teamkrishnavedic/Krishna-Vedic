import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Clock, Share2, Scale, Cookie, UserCheck, AlertCircle, FileText } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

export default function PrivacyPage() {
  const { supportPhone, supportEmail, millAddress, brandName } = useStoreSettings();

  return (
    <div className="max-w-5xl mx-auto px-gutter-mobile md:px-margin py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-12 text-center space-y-3 border-b border-outline-variant/30 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          Indian DPDP Act, 2023 &amp; IT Act, 2000 Compliant
        </div>
        <h1 className="font-headline-lg text-headline-lg md:text-4xl text-primary font-serif">
          Privacy Policy &amp; Data Protection Framework
        </h1>
        <p className="text-on-surface-variant text-sm max-w-2xl mx-auto">
          How Krishna Vedic collects, utilizes, safeguards, retains, and shares your personal data in strict compliance with the legal framework of the Republic of India.
        </p>
        <p className="text-outline text-xs">
          Effective Date: October 2026 • Last Reviewed &amp; Updated: November 2026
        </p>
      </div>

      {/* Highlights / Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">256-Bit SSL Encryption</h3>
          <p className="text-xs text-on-surface-variant">
            All data in transit is encrypted using modern TLS 1.3 / 256-bit SSL. Payment card details are never stored on our servers.
          </p>
        </div>
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
            <Share2 className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">Zero Ad Broker Sharing</h3>
          <p className="text-xs text-on-surface-variant">
            We never sell, rent, or lease your personal information. Data is shared exclusively with verified delivery and payment partners.
          </p>
        </div>
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-on-surface text-base mb-1">DPDP Act 2023 Rights</h3>
          <p className="text-xs text-on-surface-variant">
            You hold statutory rights to access, correct, or request erasure of your data, backed by a designated Indian Grievance Officer.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="bg-surface-container-lowest p-6 sm:p-10 border border-outline-variant/30 rounded-xl space-y-10 text-on-surface-variant text-sm leading-relaxed shadow-xs">
        
        {/* Preamble */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <FileText className="w-5 h-5 text-secondary" />
            Preamble &amp; Statutory Background
          </h2>
          <p>
            This Privacy Policy governs the manner in which <strong>{brandName}</strong> (&quot;Krishna Vedic&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating from its mill facility in Jaipur, Rajasthan, collects, stores, processes, discloses, and protects personal data obtained from customers and visitors (&quot;Data Principals&quot; or &quot;Users&quot;) accessing <Link to="/" className="text-secondary underline font-medium">krishnavedic.com</Link> and associated mobile and digital interfaces.
          </p>
          <p>
            This policy is formulated in strict adherence to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-on-surface">
            <li>The <strong>Digital Personal Data Protection Act (DPDP Act), 2023</strong> and rules notified thereunder.</li>
            <li>Section 43A of the <strong>Information Technology Act, 2000</strong> read with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (&quot;SPDI Rules&quot;).</li>
            <li>The <strong>Consumer Protection (E-Commerce) Rules, 2020</strong> framed under the Consumer Protection Act, 2019.</li>
            <li>The <strong>Food Safety and Standards Act, 2006 (FSSAI)</strong> and associated traceability regulations.</li>
          </ul>
        </section>

        {/* Section 1: Data We Collect */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <Eye className="w-5 h-5 text-secondary" />
            1. Which Personal Data We Collect
          </h2>
          <p>
            We collect personal data strictly on a need-to-know basis to fulfill your cold-pressed oil and spice orders, ensure food safety traceability, and manage customer relations. The categories of data collected include:
          </p>
          
          <div className="space-y-4 pt-2">
            <div className="bg-surface-container-low p-4 rounded-md border-l-4 border-primary">
              <h4 className="font-semibold text-on-surface text-sm mb-1">A. Identity &amp; Contact Information</h4>
              <p className="text-xs">
                Your full legal name, delivery recipient name, valid 10-digit Indian mobile telephone number, email address, and Google account profile identifier (name and email) when using Google 1-Click Authentication.
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-md border-l-4 border-secondary">
              <h4 className="font-semibold text-on-surface text-sm mb-1">B. Delivery &amp; Geographical Logistics Data</h4>
              <p className="text-xs">
                Complete postal delivery address including door/flat number, street name, apartment/building, landmark, city, district, state, and 6-digit Indian PIN code, along with any optional transit instructions provided by you.
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-md border-l-4 border-primary">
              <h4 className="font-semibold text-on-surface text-sm mb-1">C. Order, Invoicing &amp; Transaction Metadata</h4>
              <p className="text-xs">
                Items purchased, bottle batch sizes, order totals in INR, discount coupon redemptions, selected payment mode (Prepaid Online or Cash on Delivery), transaction timestamp, and unique payment gateway confirmation reference IDs issued by Razorpay.
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-md border-l-4 border-outline">
              <h4 className="font-semibold text-on-surface text-sm mb-1">D. Technical, Session &amp; Device Telemetry</h4>
              <p className="text-xs">
                IP address, browser type and version, device operating system, referring URL, time of access, and strictly essential session cookie tokens (<code className="bg-surface-container px-1 py-0.5 rounded text-primary font-mono text-[11px]">kv.sid</code>) required to sustain your authenticated login session and shopping cart state.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-md text-xs text-on-surface">
            <strong>Exclusion of Sensitive Financial Credentials:</strong> Krishna Vedic <em>never</em> stores, processes, or captures your credit card numbers, debit card PINs, CVV codes, UPI MPINs, or NetBanking login credentials on our servers. All financial instrument processing is securely tokenized and handled directly by RBI-authorized, PCI-DSS Level 1 compliant payment aggregators (Razorpay).
          </div>
        </section>

        {/* Section 2: Why We Collect Data */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <UserCheck className="w-5 h-5 text-secondary" />
            2. Why We Collect Your Data (Purpose Limitation)
          </h2>
          <p>
            In conformity with Section 4 and Section 6 of the DPDP Act 2023, your personal data is collected and processed solely for specified, explicit, and legitimate commercial and statutory purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Physical Order Fulfillment:</strong> Cold-pressing, fresh packaging, labeling, and dispatching your lots from our Jaipur mill to your nominated shipping address.
            </li>
            <li>
              <strong>Courier Tracking &amp; Delivery Alerts:</strong> Transmitting transactional SMS, WhatsApp updates, and email notifications containing live Air Waybill (AWB) consignment tracking links.
            </li>
            <li>
              <strong>Statutory Tax Invoicing &amp; Audit:</strong> Generating legally binding GST invoices in accordance with the Central Goods and Services Tax Act, 2017, and maintaining traceability records under FSSAI food licensing standards.
            </li>
            <li>
              <strong>Customer Support &amp; Dispute Resolution:</strong> Assisting you via WhatsApp support or phone with inquiries, delivery re-routing, transit breakage claims, or replacement requests.
            </li>
            <li>
              <strong>Fraud Prevention &amp; Platform Security:</strong> Mitigating unauthorized account access, duplicate discount abuse, automated bot scraping, and payment fraud.
            </li>
          </ul>
        </section>

        {/* Section 3: Data Retention */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <Clock className="w-5 h-5 text-secondary" />
            3. How Long We Keep Your Data (Data Retention Schedule)
          </h2>
          <p>
            We retain personal data only for the period necessary to fulfill the purposes outlined in this policy, unless a longer retention period is explicitly mandated by Indian statutory law:
          </p>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs border border-outline-variant/30 rounded-md overflow-hidden">
              <thead className="bg-surface-container font-serif text-primary">
                <tr>
                  <th className="p-3 border-b border-outline-variant/30 font-semibold">Data Category</th>
                  <th className="p-3 border-b border-outline-variant/30 font-semibold">Retention Period</th>
                  <th className="p-3 border-b border-outline-variant/30 font-semibold">Statutory Basis / Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                <tr>
                  <td className="p-3 font-medium text-on-surface">Customer Account &amp; Saved Addresses</td>
                  <td className="p-3">Duration of active account</td>
                  <td className="p-3 text-on-surface-variant">Maintained until customer requests account closure or erasure under DPDP Act.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-on-surface">Invoices, Tax Records &amp; Order History</td>
                  <td className="p-3 font-semibold text-primary">Up to 8 Statutory Years</td>
                  <td className="p-3 text-on-surface-variant">Mandated under Section 128 of the Companies Act, 2013 and Section 36 of CGST Act, 2017.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-on-surface">Guest Sessions &amp; Cart State</td>
                  <td className="p-3">7 to 30 days</td>
                  <td className="p-3 text-on-surface-variant">Ephemeral storage to allow customers to return to their pending checkout.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-on-surface">Web Server &amp; Security Error Logs</td>
                  <td className="p-3">90 days</td>
                  <td className="p-3 text-on-surface-variant">Rotated and automatically purged after security verification.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Data Sharing */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <Share2 className="w-5 h-5 text-secondary" />
            4. By Whom Your Data Is Shared (Third-Party Processors)
          </h2>
          <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-md text-xs font-medium text-on-surface mb-3">
            <strong>Absolute Guarantee:</strong> Krishna Vedic does <strong>NOT</strong> sell, rent, monetize, or disclose your personal contact or demographic data to commercial advertising brokers, data syndicates, or telemarketers.
          </div>
          <p>
            We share necessary data exclusively with trusted third-party service providers (&quot;Data Processors&quot;) who are contractually bound to process data strictly under our instructions and in compliance with Indian data protection standards:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Verified National Logistics Partners (BlueDart, Delhivery, DTDC, Shiprocket):</strong> Name, shipping address, mobile number, and consignment weight to execute door delivery and communicate transit milestones.
            </li>
            <li>
              <strong>RBI-Regulated Payment Aggregators (Razorpay Software Pvt Ltd):</strong> Name, billing details, and order amount to securely process online payments via UPI, RuPay/Visa/MasterCard, and NetBanking.
            </li>
            <li>
              <strong>Transactional Communication Gateways (Resend / WhatsApp Business API / Twilio):</strong> Email address and mobile phone number for sending essential order confirmations, AWB updates, and one-time verification tokens.
            </li>
            <li>
              <strong>Encrypted Cloud Hosting Infrastructure (Vercel, Aiven PostgreSQL, AWS):</strong> Encrypted database and server infrastructure hosted in security-certified data centers with automated backups.
            </li>
            <li>
              <strong>Statutory &amp; Law Enforcement Bodies:</strong> Disclosed only when strictly required by a formal notice, summons, or court order issued by an Indian court of competent jurisdiction or authorized law enforcement agency.
            </li>
          </ul>
        </section>

        {/* Section 5: Data Security & SSL */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <Lock className="w-5 h-5 text-secondary" />
            5. Technical Security &amp; 256-Bit SSL Encryption
          </h2>
          <p>
            Krishna Vedic implements rigorous administrative, physical, and technical safeguards in accordance with Rule 8 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30">
              <span className="font-semibold text-primary block mb-1">✓ 256-Bit SSL/TLS 1.3 Encryption</span>
              All communications between your browser and our servers are encrypted using modern Transport Layer Security certificates with HTTP Strict Transport Security (HSTS).
            </div>
            <div className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30">
              <span className="font-semibold text-primary block mb-1">✓ Zero Plaintext Passwords</span>
              Internal passwords (where utilized) are hashed using salted 12-round bcrypt cryptographic algorithms. Google OAuth tokens are verified directly with Google identity servers.
            </div>
            <div className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30">
              <span className="font-semibold text-primary block mb-1">✓ Secure Cookie Architecture</span>
              Authentication cookies are tagged with <code className="font-mono text-primary">HttpOnly</code>, <code className="font-mono text-primary">Secure</code>, and <code className="font-mono text-primary">SameSite=Lax</code> to prevent Cross-Site Scripting (XSS) and CSRF attacks.
            </div>
            <div className="bg-surface-container-low p-3.5 rounded border border-outline-variant/30">
              <span className="font-semibold text-primary block mb-1">✓ Role-Based Access Controls</span>
              Access to customer order data is strictly restricted to authorized fulfillment staff via authenticated admin dashboards with full audit logging.
            </div>
          </div>
        </section>

        {/* Section 6: Cookies & Tracking Disclosure */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <Cookie className="w-5 h-5 text-secondary" />
            6. Cookies &amp; Tracking Disclosure
          </h2>
          <p>
            A cookie is a small data snippet placed on your device. We believe in absolute transparency regarding web tracking:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong>Strictly Essential Cookies (<code className="font-mono text-primary">kv.sid</code>):</strong> Necessary for you to sign in, navigate pages, and keep selected cold-pressed oils in your shopping cart across browser reloads.
            </li>
            <li>
              <strong>Security &amp; CSRF Tokens:</strong> Temporary tokens that verify submitted checkout forms are authentic and protect you from fraudulent third-party submissions.
            </li>
            <li>
              <strong>No Invasive Advertising Trackers:</strong> We <em>do not</em> deploy invasive cross-site ad retargeting pixels, fingerprinters, or hidden tracking software that records your personal browsing activity across the web.
            </li>
          </ul>
          <p className="text-xs">
            You can modify your browser settings to decline cookies. However, disabling strictly essential session cookies will prevent the shopping cart and checkout authentication from functioning properly.
          </p>
        </section>

        {/* Section 7: Data Principal Rights */}
        <section className="space-y-3 pt-6 border-t border-outline-variant/20">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <Scale className="w-5 h-5 text-secondary" />
            7. Your Legal Rights Under DPDP Act, 2023
          </h2>
          <p>
            As a Data Principal residing in India, you are endowed with distinct statutory rights under the Digital Personal Data Protection Act, 2023:
          </p>
          <div className="space-y-2 text-xs">
            <p>• <strong>Right to Access Information:</strong> You may request a summary of the personal data held about you and the processing activities undertaken.</p>
            <p>• <strong>Right to Correction &amp; Completion:</strong> You may update outdated delivery addresses or phone numbers via your <Link to="/account" className="text-secondary underline font-medium">Account Settings</Link> or by contacting our team.</p>
            <p>• <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request the deletion of your account profile. Note that order records and tax invoices must be retained for the statutory 8-year period mandated by the Indian Companies Act and GST rules.</p>
            <p>• <strong>Right to Nominate:</strong> You have the right to nominate another individual who may exercise your data rights in the event of death or incapacity.</p>
            <p>• <strong>Right to Withdraw Consent:</strong> You may withdraw consent for promotional harvest folios at any time by clicking the unsubscribe link or contacting support.</p>
          </div>
        </section>

        {/* Section 8: Statutory Grievance Redressal */}
        <section className="space-y-4 pt-6 border-t border-outline-variant/20 bg-surface-container-low p-6 rounded-lg border border-outline-variant/30">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-secondary" />
            8. Statutory Grievance Redressal Officer
          </h2>
          <p className="text-xs">
            In compliance with Rule 5(9) of the Information Technology Rules, 2011 and Rule 4 of the Consumer Protection (E-Commerce) Rules, 2020, the designated Grievance Officer details are published below:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <p className="font-bold text-on-surface">Designation:</p>
              <p className="text-on-surface-variant">Grievance Redressal &amp; Data Protection Officer</p>
              <p className="font-bold text-on-surface mt-2">Company:</p>
              <p className="text-on-surface-variant">{brandName}</p>
              <p className="font-bold text-on-surface mt-2">Physical Mill &amp; Corporate Address:</p>
              <p className="text-on-surface-variant">{millAddress}</p>
            </div>
            <div>
              <p className="font-bold text-on-surface">Email Address:</p>
              <p>
                <a href={`mailto:${supportEmail}`} className="text-secondary underline font-semibold">
                  {supportEmail}
                </a>
              </p>
              <p className="font-bold text-on-surface mt-2">Telephone / WhatsApp Desk:</p>
              <p>
                <a href={`tel:${supportPhone}`} className="text-secondary underline font-semibold">
                  {supportPhone}
                </a>
              </p>
              <p className="font-bold text-on-surface mt-2">Resolution Timelines (IT Rules 2021):</p>
              <p className="text-on-surface-variant">
                Acknowledgment within <strong>48 hours</strong>; complete resolution within <strong>30 days</strong>.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Footer Navigation Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-on-surface-variant border-t border-outline-variant/30 pt-6">
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-primary underline">Terms &amp; Conditions</Link>
          <Link to="/shipping" className="hover:text-primary underline">Shipping Policy</Link>
          <Link to="/returns" className="hover:text-primary underline">Returns &amp; Refunds</Link>
          <Link to="/contact" className="hover:text-primary underline">Contact Grievance Desk</Link>
        </div>
        <div>
          Governed by the laws of India • Jurisdiction: Jaipur, Rajasthan
        </div>
      </div>
    </div>
  );
}
