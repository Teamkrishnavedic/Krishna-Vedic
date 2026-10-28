import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import BrandLogo from '@/components/BrandLogo';
import { STORE_CONFIG } from '@/lib/storeConfig';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, itemCount, openCart } = useCart();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserDropdownOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { label: 'Products', to: '/products' },
    { label: 'Our Heritage', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafbf5] border-b border-[#e5e2da] shadow-xs transition-all">
      {/* Top Ethos / Assistance Ticker */}
      <div className="bg-[#3f674f] text-[#fafbf5] px-3 sm:px-4 text-center py-1 flex items-center justify-between text-[11px] sm:text-xs font-medium">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#fafbf5]/90">
          <span className="material-symbols-outlined text-sm">support_agent</span>
          <span>Helpdesk: {STORE_CONFIG.phone}</span>
        </div>
        <div className="mx-auto text-center tracking-wider truncate max-w-full">
          Free shipping on orders above ₹799 • Bull-Ghani &amp; Wood-Pressed Purity
        </div>
        <div className="hidden md:flex items-center gap-1 text-xs text-[#fafbf5]/90 font-medium">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Jaipur Heritage Mill</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-14 sm:h-16 md:h-20 max-w-7xl mx-auto px-3 sm:px-4 md:px-gutter flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center focus:outline-none shrink-0">
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
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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

          {/* 1. "My Orders" Button */}
          <Link
            to="/account/orders"
            className="flex items-center gap-1 bg-[#f4f4ec] text-[#6e3418] hover:bg-[#6e3418] hover:text-[#fafbf5] border border-[#e5e2da] px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 shadow-xs shrink-0"
          >
            <span className="material-symbols-outlined text-base">receipt_long</span>
            <span className="hidden xs:inline">Orders</span>
          </Link>

          {/* 2. Auth State Button: Sign In (if guest) OR User Name with Log Out dropdown (if logged in) */}
          {isAuthenticated ? (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1 sm:gap-1.5 bg-[#6e3418] text-[#fafbf5] hover:bg-[#522510] px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-xs shrink-0"
              >
                <div className="w-5 h-5 rounded-full bg-[#fafbf5] text-[#6e3418] flex items-center justify-center font-bold text-[10px] shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[55px] sm:max-w-[90px] truncate">
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
                <span className="material-symbols-outlined text-xs sm:text-sm">
                  {userDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-[#fafbf5] border border-[#e5e2da] rounded-2xl shadow-xl py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-[#e5e2da]">
                      <p className="font-bold text-[#2d2a26] truncate">{user?.name}</p>
                      <p className="text-[#7d7567] text-[11px] truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-[#2d2a26] hover:bg-[#f4f4ec] hover:text-[#6e3418] font-medium"
                    >
                      <span className="material-symbols-outlined text-base">person</span>
                      <span>Account Details</span>
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-[#2d2a26] hover:bg-[#f4f4ec] hover:text-[#6e3418] font-medium"
                    >
                      <span className="material-symbols-outlined text-base">receipt_long</span>
                      <span>Order History</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-[#b91c1c] hover:bg-[#fee2e2] font-semibold border-t border-[#e5e2da] cursor-pointer mt-1"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 bg-[#6e3418] hover:bg-[#522510] text-[#fafbf5] px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 shadow-xs shrink-0"
            >
              <span className="material-symbols-outlined text-base">person</span>
              <span className="whitespace-nowrap">Sign In</span>
            </Link>
          )}
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


    </header>
  );
}
