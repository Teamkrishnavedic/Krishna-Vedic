import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { formatPrice, formatDate, orderStatusColor } from '@/lib/utils';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: recentOrdersData } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const res = await api.get('/orders?limit=3');
      return res.data.orders || [];
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile md:px-margin py-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-outline-variant/30 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-secondary mb-1 block">
            Namaste &amp; Welcome
          </span>
          <h1 className="font-headline-lg text-headline-lg font-serif text-primary">{user?.name}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">{user?.email} • {user?.phone || 'No phone set'}</p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface hover:text-red-700 px-4 py-2 border border-outline-variant/40 bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">logout</span> Sign Out
        </button>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <Link
          to="/account/orders"
          className="bg-surface-container-low p-6 border border-outline-variant/30 hover:border-primary transition-colors flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-surface text-primary border border-outline-variant/30 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-lg font-bold text-on-surface hover:text-primary flex items-center justify-between">
              Order History <span className="material-symbols-outlined text-base">arrow_forward</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Track active dispatches, view past lot orders, and download NABL assay invoices.
            </p>
          </div>
        </Link>

        <Link
          to="/account/addresses"
          className="bg-surface-container-low p-6 border border-outline-variant/30 hover:border-primary transition-colors flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-surface text-secondary border border-outline-variant/30 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-2xl">location_on</span>
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-lg font-bold text-on-surface hover:text-primary flex items-center justify-between">
              Saved Delivery Addresses <span className="material-symbols-outlined text-base">arrow_forward</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Manage your residential and commercial delivery destinations across Bharat.
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-primary">Recent Orders</h2>
          <Link to="/account/orders" className="text-xs font-semibold text-secondary hover:underline">
            View All Orders
          </Link>
        </div>

        {recentOrdersData && recentOrdersData.length > 0 ? (
          <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 bg-surface-container-lowest overflow-hidden">
            {recentOrdersData.map((order: any) => (
              <div key={order.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-primary text-sm">
                      {order.orderNumber}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium ${orderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Placed on {formatDate(order.createdAt)} • {order.items?.length || 0} items
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <span className="font-bold text-primary text-base font-serif">
                    {formatPrice(order.total)}
                  </span>
                  <Link
                    to={`/account/orders/${order.orderNumber}`}
                    className="text-xs font-semibold text-secondary hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface-container-low border border-outline-variant/30">
            <span className="material-symbols-outlined text-3xl text-outline mb-2">package_2</span>
            <p className="text-sm font-serif font-bold text-on-surface">No orders placed yet</p>
            <p className="text-xs text-on-surface-variant mt-1 mb-4">Discover our pure wood-pressed oils and stone-ground masalas.</p>
            <Link
              to="/shop"
              className="inline-block bg-primary text-on-primary px-6 py-2 font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors"
            >
              Explore Catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
