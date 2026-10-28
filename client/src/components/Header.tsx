import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import BrandLogo from '@/components/BrandLogo';
import { STORE_CONFIG } from '@/lib/storeConfig';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { cart, itemCount, openCart } = useCart();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Products', to: '/products' },
    { label: 'Our Heritage', to: '/about' },
    { label: 'Contact & Care', to: '/contact' },
    { label: 'My Orders', to: '/account/orders' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafbf5] border-b border-[#e5e2da] rounded-b-2xl md:rounded-b-none shadow-sm md:shadow-none transition-all">
      {/* Top Ethos / Assistance Ticker */}
      <div className="bg-[#3f674f] text-[#fafbf5] px-4 md:px-margin text-center py-1.5 flex items-center justify-between font-label-md text-label-md">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#fafbf5]/90">
          <span className="material-symbols-outlined text-sm">support_agent</span>
          <span>Helpdesk: {STORE_CONFIG.phone}</span>
        </div>
        <div className="mx-auto text-center tracking-wider text-xs sm:text-[11px] font-medium">
          Free shipping on orders above ₹799 • Traditional Bull-Ghani &amp; Wood-Pressed Oils • Lab Assayed Purity
        </div>
        <div className="hidden md:flex items-center gap-1 text-xs text-[#fafbf5]/90 font-medium">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Jaipur Heritage Mill</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 md:px-gutter flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center focus:outline-none">
          <BrandLogo size="md" />
        </Link>

        {/* Center Desktop Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-label-lg text-xs uppercase tracking-widest transition-all py-1.5 px-3 rounded-full ${
                  isActive
                    ? 'bg-[#6e3418] text-[#fafbf5] font-semibold'
                    : 'text-[#52443c] hover:text-[#6e3418] hover:bg-[#f4f4ec]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Direct Contact Button (Replaces redundant search & basket on mobile) */}
          <Link
            to="/contact"
            className="flex md:hidden items-center gap-1.5 bg-[#f4f4ec] text-[#6e3418] hover:bg-[#6e3418] hover:text-[#fafbf5] border border-[#e5e2da] px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">support_agent</span>
            <span>Contact</span>
          </Link>

          {/* Search Toggle Button (Desktop & Tablet) */}
          <button
            type="button"
            aria-label="Search catalogue"
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-[#52443c] hover:text-[#6e3418] hover:bg-[#f4f4ec] transition-colors cursor-pointer border border-transparent hover:border-[#e5e2da]"
          >
            <span className="material-symbols-outlined text-xl">
              {searchOpen ? 'close' : 'search'}
            </span>
          </button>

          {/* Account Profile (Desktop) */}
          {isAuthenticated ? (
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-2 text-[#52443c] hover:text-[#6e3418] transition-colors py-1 px-2.5 rounded-full hover:bg-[#f4f4ec]"
            >
              <div className="w-8 h-8 rounded-full bg-[#3f674f] text-[#fafbf5] flex items-center justify-center font-bold text-xs ring-1 ring-[#e5e2da]">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden lg:inline text-xs font-semibold uppercase tracking-wider">
                {user?.name?.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 text-[#52443c] hover:text-[#6e3418] transition-colors py-1.5 px-3 rounded-full hover:bg-[#f4f4ec] text-xs uppercase tracking-wider font-semibold"
            >
              <span className="material-symbols-outlined text-lg">person</span>
              <span className="hidden lg:inline">Sign In</span>
            </Link>
          )}

          {/* Cart Bag Pill (Desktop & Tablet) */}
          <button
            type="button"
            onClick={openCart}
            className="hidden md:flex items-center gap-2 bg-[#6e3418] hover:bg-[#522510] px-3.5 sm:px-4 py-2 text-[#fafbf5] rounded-full transition-all duration-200 relative cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            <span className="font-label-md text-xs tracking-wider uppercase font-semibold">
              {formatPrice(cart?.subtotal || 0)}
            </span>
            {itemCount > 0 && (
              <span className="bg-[#3f674f] text-[#fafbf5] text-[10px] font-bold px-1.5 py-0.5 leading-none rounded-full border border-[#fafbf5]">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#2d2a26] hover:text-[#6e3418] hover:bg-[#f4f4ec] transition-colors border border-[#e5e2da]"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Dropdown Live Search Bar with smooth curves */}
      {searchOpen && (
        <div className="bg-[#f4f4ec] border-t border-b border-[#e5e2da] py-3.5 px-4 md:px-gutter animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bull-driven oils, kachi ghani, stone haldi, spices..."
                className="w-full bg-[#fafbf5] border border-[#e5e2da] rounded-full py-2.5 pl-11 pr-4 text-sm text-[#2d2a26] focus:outline-none focus:border-[#6e3418] focus:ring-1 focus:ring-[#6e3418]"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#7d7567] text-lg">
                search
              </span>
            </div>
            <button
              type="submit"
              className="bg-[#6e3418] hover:bg-[#522510] text-[#fafbf5] py-2.5 px-6 rounded-full font-label-md uppercase tracking-wider text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu with smooth curved border */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#fafbf5] border border-[#e5e2da] rounded-3xl m-3 p-5 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="font-label-lg text-xs uppercase tracking-wider text-[#2d2a26] hover:text-[#6e3418] hover:bg-[#f4f4ec] px-4 py-3 rounded-2xl border border-transparent hover:border-[#e5e2da] flex items-center justify-between transition-colors"
              >
                <span className="font-semibold">{link.label}</span>
                <span className="material-symbols-outlined text-base text-[#7d7567]">arrow_forward</span>
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#e5e2da] flex flex-col gap-2 text-xs text-[#7d7567]">
            <div className="flex items-center justify-between">
              <span>Jaipur Helpline:</span>
              <a href={`tel:${STORE_CONFIG.phone.replace(/\s+/g, '')}`} className="font-bold text-[#6e3418] hover:underline">
                {STORE_CONFIG.phone}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span>Official Care:</span>
              <a href={`mailto:${STORE_CONFIG.email}`} className="font-medium text-[#2d2a26]">
                {STORE_CONFIG.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
