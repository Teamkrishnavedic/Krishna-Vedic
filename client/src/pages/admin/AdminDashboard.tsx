import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice, formatDate, orderStatusColor } from '@/lib/utils';

export default function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data;
    },
  });

  const stats = data?.stats;
  const recentOrders = data?.recentOrders || [];
  const lowStock = data?.lowStock || [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-serif text-primary">
            Store Performance &amp; Operations
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">Real-time performance and inventory management</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="bg-primary hover:bg-secondary text-on-primary py-2 px-4 text-xs uppercase font-label-md tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span> Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="bg-surface text-on-surface border border-outline-variant/40 py-2 px-4 text-xs uppercase font-label-md tracking-wider hover:bg-surface-container transition-colors cursor-pointer"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-low p-6 border border-outline-variant/30 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-outline">Today's Revenue</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">trending_up</span>
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-primary mt-2">
            {formatPrice(stats?.todayRevenue || 0)}
          </p>
          <p className="text-[11px] text-outline mt-1">
            Total All-Time: {formatPrice(stats?.totalRevenue || 0)}
          </p>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant/30 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-outline">Today's Orders</span>
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-on-surface mt-2">
            {stats?.todayOrders || 0}
          </p>
          <p className="text-[11px] text-outline mt-1">
            Total Orders: {stats?.totalOrders || 0}
          </p>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant/30 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-outline">Pending Fulfillment</span>
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">schedule</span>
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-primary mt-2">
            {stats?.pendingOrders || 0}
          </p>
          <p className="text-[11px] text-primary mt-1 font-semibold">
            Requires packing &amp; dispatch
          </p>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant/30 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-outline">Active Customers</span>
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-lg">group</span>
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-on-surface mt-2">
            {stats?.totalCustomers || 0}
          </p>
          <p className="text-[11px] text-outline mt-1">Registered patron accounts</p>
        </div>
      </div>

      {/* Low Stock Warning Box */}
      {lowStock && lowStock.length > 0 && (
        <div className="p-5 bg-surface-container-high border border-outline-variant/40 rounded-3xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-lg">report_problem</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                Low Stock Alert ({lowStock.length} items need replenishment)
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {lowStock.map((item: any) => (
                  <Link
                    key={item.id}
                    to="/admin/inventory"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest border border-outline-variant/30 rounded-full text-xs font-medium text-on-surface hover:border-primary transition-colors"
                  >
                    <span>{item.productName} ({item.variantName})</span>
                    <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">Stock: {item.stock}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/admin/inventory"
              className="text-xs font-bold text-secondary hover:underline whitespace-nowrap pt-1"
            >
              Manage Inventory &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-primary">Recent Customer Orders</h2>
          <Link to="/admin/orders" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
            View All Orders <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-outline">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-surface-container">
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      {order.user?.name || order.shippingName}
                    </td>
                    <td className="py-3 px-4 text-outline">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${orderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-primary font-serif">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        to={`/admin/orders/${order.orderNumber}`}
                        className="text-secondary hover:underline font-semibold"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
