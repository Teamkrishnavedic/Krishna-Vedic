import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { STORE_CONFIG } from '@/lib/storeConfig';

export default function ContactPage() {
  const { toast } = useToast();
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
    <div className="max-w-7xl mx-auto px-gutter-mobile md:px-margin py-16">
      <div className="max-w-3xl mb-12 space-y-2 border-b border-outline-variant/30 pb-4">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          Customer Care Desk
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">
          Atelier Inquiries &amp; Mill Concierge
        </h1>
        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
          Have questions regarding cold-press extraction batches, NABL assay sheets, wholesale bulk allocation, or existing orders? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-low p-6 border border-outline-variant/30 space-y-4">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-primary mt-0.5">location_on</span>
              <div>
                <h3 className="font-bold text-on-surface text-sm font-serif">Store &amp; Ghani Mill</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {STORE_CONFIG.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-outline-variant/30">
              <span className="material-symbols-outlined text-2xl text-primary mt-0.5">call</span>
              <div>
                <h3 className="font-bold text-on-surface text-sm font-serif">Helpdesk &amp; WhatsApp</h3>
                <p className="text-xs text-on-surface-variant mt-1">{STORE_CONFIG.phone} {STORE_CONFIG.phoneAlt ? `/ ${STORE_CONFIG.phoneAlt}` : ''}</p>
                <p className="text-xs text-outline mt-0.5">{STORE_CONFIG.hours}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-outline-variant/30">
              <span className="material-symbols-outlined text-2xl text-primary mt-0.5">mail</span>
              <div>
                <h3 className="font-bold text-on-surface text-sm font-serif">Email Folio</h3>
                <p className="text-xs text-on-surface-variant mt-1">{STORE_CONFIG.email}</p>
                <p className="text-xs text-on-surface-variant">{STORE_CONFIG.ordersEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-outline-variant/30">
              <span className="material-symbols-outlined text-2xl text-primary mt-0.5">schedule</span>
              <div>
                <h3 className="font-bold text-on-surface text-sm font-serif">Fresh Pressing Hours</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Mara Chekku ghanis operate daily from 6:00 AM to 1:00 PM. Visitors are welcome with prior appointment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-low p-8 border border-outline-variant/30">
          <h2 className="font-serif text-xl font-bold text-primary mb-6 pb-2 border-b border-outline-variant/30">
            Send a Direct Dispatch Message
          </h2>

          {isSent ? (
            <div className="py-12 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-secondary">verified</span>
              <h3 className="font-serif text-xl text-primary font-bold">Message Delivered</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Thank you for contacting our atelier. One of our milling associates will review your inquiry and reply within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="bg-secondary text-on-secondary px-6 py-2.5 font-label-md text-label-md uppercase tracking-wider hover:bg-primary transition-colors cursor-pointer mt-4"
              >
                Send Another Dispatch
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
                    className="input"
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
                    className="input"
                    placeholder="email@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="label">Mobile Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input"
                  placeholder="Optional, for WhatsApp callback"
                />
              </div>

              <div>
                <label className="label">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input"
                  placeholder="Detail your inquiry regarding batches, bulk supply, or pantry shipments..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-secondary text-on-primary py-3 px-8 font-label-md text-label-md uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Dispatch'}</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
