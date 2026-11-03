import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle2, Send, Navigation, ExternalLink } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { STORE_CONFIG } from '@/lib/storeConfig';

export default function ContactPage() {
  const { toast } = useToast();
  const { storeName, supportEmail, supportPhone, millAddress, getWhatsappUrl } = useStoreSettings();

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast({
        title: 'Dispatch Received',
        description: 'Thank you for reaching out. Our milling atelier team will contact you shortly.',
        variant: 'success',
      });
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-3xl mb-10 space-y-2 border-b border-[#e5e2da] pb-4">
        <span className="text-xs uppercase tracking-widest text-[#6e3418] font-bold">
          Customer Care Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2d2a26] font-bold">
          Get in Touch with {storeName}
        </h1>
        <p className="text-[#52443c] text-sm mt-1 leading-relaxed">
          Have questions regarding cold-press extraction batches, wholesale bulk allocation, or existing orders? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick WhatsApp Action Card */}
          <div className="bg-[#eef5f1] border border-[#3f674f]/30 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f674f] bg-white/70 px-2.5 py-0.5 rounded-full">
                Fastest Response
              </span>
              <p className="font-serif text-base font-bold text-[#2d2a26] mt-1.5">Chat on WhatsApp</p>
              <p className="text-xs text-[#52443c] mt-0.5">Direct answers for order tracking &amp; fresh batches</p>
            </div>
            <a
              href={getWhatsappUrl(`Hello ${storeName}, I would like to inquire about your products.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="bg-[#fafbf5] p-6 rounded-3xl border border-[#e5e2da] space-y-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#f4f4ec] flex items-center justify-center shrink-0 text-[#6e3418]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2a26] text-sm font-serif">Store &amp; Ghani Mill</h3>
                <p className="text-xs text-[#52443c] mt-1 leading-relaxed">
                  {millAddress}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(millAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#6e3418] font-bold hover:underline mt-2.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions in Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-[#e5e2da]">
              <div className="w-9 h-9 rounded-full bg-[#f4f4ec] flex items-center justify-center shrink-0 text-[#6e3418]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2a26] text-sm font-serif">Helpdesk &amp; Mobile</h3>
                <a href={`tel:${supportPhone}`} className="text-xs text-[#6e3418] hover:underline font-semibold mt-1 block">
                  {supportPhone}
                </a>
                <p className="text-[11px] text-[#7d7567] mt-0.5">{STORE_CONFIG.hours}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-[#e5e2da]">
              <div className="w-9 h-9 rounded-full bg-[#f4f4ec] flex items-center justify-center shrink-0 text-[#6e3418]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2a26] text-sm font-serif">Email Folio</h3>
                <a href={`mailto:${supportEmail}`} className="text-xs text-[#6e3418] hover:underline font-semibold mt-1 block">
                  {supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-[#e5e2da]">
              <div className="w-9 h-9 rounded-full bg-[#f4f4ec] flex items-center justify-center shrink-0 text-[#6e3418]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d2a26] text-sm font-serif">Fresh Pressing Hours</h3>
                <p className="text-xs text-[#52443c] mt-1 leading-relaxed">
                  Vagai wood ghanis operate daily from 6:00 AM to 1:00 PM. Visitors are welcome with prior appointment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#fafbf5] p-6 sm:p-8 rounded-3xl border border-[#e5e2da] shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#2d2a26] mb-6 pb-2 border-b border-[#e5e2da]">
            Send a Direct Message
          </h2>

          {isSent ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#3f674f] mx-auto" />
              <h3 className="font-serif text-xl text-[#2d2a26] font-bold">Message Delivered</h3>
              <p className="text-xs text-[#52443c] max-w-sm mx-auto leading-relaxed">
                Thank you for contacting us. One of our milling associates will review your inquiry and reply within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="bg-[#6e3418] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#522510] transition-colors cursor-pointer mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input rounded-xl text-xs"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="label">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input rounded-xl text-xs"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="label">Mobile Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input rounded-xl text-xs"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="label">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input rounded-xl text-xs resize-y"
                  placeholder="Tell us how we can help — product inquiries, harvest queries, or wholesale requirements..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#6e3418] hover:bg-[#522510] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ─── Interactive Google Map & Directions ─── */}
      <div className="mt-12 bg-[#fafbf5] rounded-3xl border border-[#e5e2da] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e5e2da]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6e3418]">
              <MapPin className="w-4 h-4" />
              <span>Physical Store Location</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2d2a26] mt-1">
              Visit Our Ghani Mill &amp; Store
            </h2>
            <p className="text-xs text-[#52443c] mt-0.5 leading-relaxed max-w-xl">
              {millAddress}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(millAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#6e3418] hover:bg-[#522510] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <a
              href={`tel:${supportPhone}`}
              className="border border-[#6e3418] text-[#6e3418] hover:bg-[#6e3418] hover:text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Mill</span>
            </a>
          </div>
        </div>

        {/* Embedded Interactive Google Map */}
        <div className="relative w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden border border-[#e5e2da] shadow-inner bg-[#f4f4ec]">
          <iframe
            title="Krishna Vedic Store Google Map Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(millAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
        </div>
        <p className="text-[11px] text-[#7d7567] mt-3 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#6e3418]" />
          <span>Click "View larger map" or "Get Directions" to start live GPS turn-by-turn navigation on your mobile phone.</span>
        </p>
      </div>
    </div>
  );
}
