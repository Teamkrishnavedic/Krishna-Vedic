import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function MobileBottomNav() {
  const { itemCount, openCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="xl:hidden fixed bottom-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md sm:w-full z-40 bg-[#fafbf5]/95 backdrop-blur-md border border-[#e5e2da] rounded-full px-2.5 py-1.5 shadow-lg shadow-[#2d2a26]/10">
      <div className="flex items-center justify-around">
        {/* Home */}
        <NavLink
          to="/"
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all ${
            isCurrent('/')
              ? 'bg-[#6e3418] text-[#fafbf5] font-bold shadow-sm'
              : 'text-[#7d7567] hover:text-[#2d2a26]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold">Home</span>
        </NavLink>

        {/* Products / Categories Catalog (Amazon style) */}
        <NavLink
          to="/categories"
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all ${
            isCurrent('/categories') || isCurrent('/shop')
              ? 'bg-[#6e3418] text-[#fafbf5] font-bold shadow-sm'
              : 'text-[#7d7567] hover:text-[#2d2a26]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">grid_view</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold">Products</span>
        </NavLink>

        {/* Search */}
        <NavLink
          to="/search"
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all ${
            isCurrent('/search')
              ? 'bg-[#6e3418] text-[#fafbf5] font-bold shadow-sm'
              : 'text-[#7d7567] hover:text-[#2d2a26]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">search</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold">Search</span>
        </NavLink>

        {/* Cart Trigger */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-[#7d7567] hover:text-[#6e3418] transition-colors relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">shopping_bag</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold">Basket</span>
          {itemCount > 0 && (
            <span className="absolute top-0.5 right-1.5 bg-[#3f674f] text-[#fafbf5] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {itemCount}
            </span>
          )}
        </button>

        {/* Account / Login */}
        <NavLink
          to={isAuthenticated ? '/account' : '/login'}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all ${
            isCurrent('/account') || isCurrent('/login')
              ? 'bg-[#6e3418] text-[#fafbf5] font-bold shadow-sm'
              : 'text-[#7d7567] hover:text-[#2d2a26]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">person</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold">
            {isAuthenticated ? user?.name?.split(' ')[0] || 'Account' : 'Sign In'}
          </span>
        </NavLink>
      </div>
    </nav>
  );
}
