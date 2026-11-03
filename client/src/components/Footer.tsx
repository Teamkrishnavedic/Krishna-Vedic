import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const { supportPhone, supportEmail, millAddress, getWhatsappUrl } = useStoreSettings();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Joined Harvest Folio',
        description: 'Thank you for subscribing to our seasonal press updates.',
        variant: 'success',
      });
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 mt-space-xxl">
      <div className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter pt-space-xxl pb-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl border-b border-outline-variant/30">
          {/* Brand Intro & Newsletter (2 cols) */}
          <div className="lg:col-span-2 space-y-space-md">
            <Link to="/" className="inline-block">
              <BrandLogo size="lg" />
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md leading-relaxed">
              Pure, authentic wood-pressed kachi ghani oils and freshly stone-ground spices. Crafted using traditional cold-press extraction with zero chemicals, preservatives, or artificial refining — delivered fresh from our mill in Rajasthan.
            </p>
            <div className="pt-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold block mb-2">
                Newsletter &amp; Harvest Folio
              </span>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-4 py-2.5 rounded-full border border-outline-variant focus:outline-none focus:border-primary placeholder:text-outline"
                />
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors whitespace-nowrap cursor-pointer font-semibold shadow-xs"
                >
                  Join
                </button>
              </form>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">
                Receive authentic seasonal recipes, lab assay reports &amp; harvest updates.
              </p>
            </div>
          </div>

          {/* Shop Categories Column */}
          <div className="space-y-space-sm">
            <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-primary font-bold">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors">
                <Link to="/shop/cold-pressed-oils">Wood-Pressed Oils</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/shop/spices-masalas">Stone-Pounded Spices</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/shop/flour-atta">Stone-Ground Atta &amp; Flours</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/shop/ghee-honey-other-products">Desi Cow Ghee &amp; Honey</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/shop/whole-grains-cereals">Traditional Whole Grains</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/shop/oil-cakes-khal">Pure Oil Cakes (Khal)</Link>
              </li>
              <li className="hover:text-primary transition-colors pt-1">
                <Link to="/shop" className="font-semibold text-primary underline underline-offset-4">
                  Browse All Harvest →
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Policies Column */}
          <div className="space-y-space-sm">
            <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-primary font-bold">
              About &amp; Policies
            </h3>
            <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors">
                <Link to="/about">Our Story &amp; Ghani Ethos</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/contact">Visit Our Ghani Mill</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/shipping">Shipping Across Bharat</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/returns">Returns &amp; Replacement Policy</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/terms">Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-space-sm">
            <h3 className="font-label-lg text-label-lg uppercase tracking-wider text-primary font-bold">
              Customer Care
            </h3>
            <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors">
                <a
                  href={getWhatsappUrl('Hello Krishna Vedic, I would like to inquire about customer support.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#3f674f] font-semibold"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp Support
                </a>
              </li>
              <li className="hover:text-primary transition-colors">
                <a href={`tel:${supportPhone}`} className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {supportPhone}
                </a>
              </li>
              <li className="hover:text-primary transition-colors">
                <a href={`mailto:${supportEmail}`} className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {supportEmail}
                </a>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/account/orders">Track My Orders</Link>
              </li>
              <li className="hover:text-primary transition-colors">
                <Link to="/contact">Contact Helpdesk</Link>
              </li>
              <li className="pt-2 border-t border-outline-variant/30">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(millAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-start gap-1.5 group text-xs text-on-surface-variant"
                  title="Open location in Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-secondary group-hover:text-primary transition-colors" />
                  <div>
                    <span className="block font-medium text-on-surface group-hover:text-primary transition-colors">
                      Mill &amp; Store (Jaipur, RJ)
                    </span>
                    <span className="text-[11px] text-primary font-semibold underline underline-offset-2">
                      View on Google Maps →
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Trust Badges */}
        <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 font-label-md text-label-md">
              <span className="material-symbols-outlined text-secondary text-sm">eco</span>
              100% Raw &amp; Wood-Pressed
            </span>
            <span className="flex items-center gap-1.5 font-label-md text-label-md">
              <span className="material-symbols-outlined text-secondary text-sm">inventory_2</span>
              Zero Plastic Glass Containers
            </span>
            <span className="flex items-center gap-1.5 font-label-md text-label-md">
              <span className="material-symbols-outlined text-secondary text-sm">verified</span>
              NABL Lab Tested
            </span>
            <span className="flex items-center gap-1.5 font-label-md text-label-md text-primary font-medium">
              <span className="material-symbols-outlined text-secondary text-sm">lock</span>
              256-Bit SSL Secured
            </span>
          </div>
          <div className="text-center md:text-right text-xs">
            © 2026 Krishna Vedic Heritage Foods Pvt Ltd. Crafted with reverence.
          </div>
        </div>
      </div>
    </footer>
  );
}
