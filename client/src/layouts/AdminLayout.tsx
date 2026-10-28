import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
  { to: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { to: '/admin/categories', label: 'Categories', icon: 'category' },
  { to: '/admin/orders', label: 'Orders', icon: 'local_shipping' },
  { to: '/admin/customers', label: 'Customers', icon: 'group' },
  { to: '/admin/coupons', label: 'Coupons', icon: 'sell' },
  { to: '/admin/inventory', label: 'Inventory', icon: 'warehouse' },
  { to: '/admin/price-history', label: 'Price History', icon: 'history' },
  { to: '/admin/shipping', label: 'Shipping Rules', icon: 'local_shipping' },
  { to: '/admin/reports', label: 'Reports', icon: 'monitoring' },
  { to: '/admin/staff', label: 'Staff Roles', icon: 'badge' },
  { to: '/admin/audit-log', label: 'Audit Log', icon: 'receipt_long' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-inverse-surface text-inverse-on-surface w-64 shrink-0 border-r border-outline-variant/30">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Krishnavedic"
          className="h-10 w-auto object-contain rounded-lg"
        />
        <div>
          <p className="font-serif text-sm font-bold text-on-primary tracking-wide">Krishnavedic</p>
          <p className="text-[10px] text-outline-variant uppercase tracking-widest font-semibold">Master Milling Suite</p>
        </div>
      </div>

      {/* User */}
      <div className="mx-3 my-3 p-3.5 rounded-2xl border border-outline-variant/20 bg-surface-container-highest/10">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-on-primary truncate">{user?.name || 'Vedic Admin'}</p>
          <span className="text-[9px] px-2.5 py-0.5 bg-secondary text-on-secondary font-bold uppercase tracking-wider rounded-full">
            {user?.role || 'ADMIN'}
          </span>
        </div>
        <p className="text-xs text-outline-variant truncate mt-0.5">{user?.email}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer rounded-2xl ${
                isActive
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-inverse-on-surface/80 hover:text-white hover:bg-surface-container-highest/20'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-outline-variant/20 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-inverse-on-surface/80 hover:text-white hover:bg-surface-container-highest/20 transition-colors rounded-xl"
        >
          <span className="material-symbols-outlined text-sm">storefront</span>
          View Storefront
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-inverse-on-surface/80 hover:text-red-300 transition-colors w-full text-left cursor-pointer rounded-xl"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-surface-container-low border-b border-outline-variant/30 px-4 sm:px-6 h-16 flex items-center gap-4">
          <button
            className="lg:hidden p-2 text-on-surface hover:text-primary cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <div className="flex-1" />
          <span className="text-xs text-on-surface-variant font-medium">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
