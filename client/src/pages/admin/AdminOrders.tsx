import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice, formatDate, orderStatusColor } from '@/lib/utils';

export default function AdminOrders() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', status, search, page],
    queryFn: async () => {
      let url = `/admin/orders?page=${page}&limit=20`;
      if (status) url += `&status=${status}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      return res.data;
    },
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-outline-variant/30">
        <h1 className="font-headline-lg text-headline-lg font-serif text-primary">Customer Orders</h1>
        <p className="text-xs text-on-surface-variant mt-1">Track, pack, and fulfill orders with status progression</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-low p-5 border border-outline-variant/30 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order #, name or phone..."
            className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/40 pl-10 pr-4 py-2.5 text-xs rounded-full focus:outline-none focus:border-primary shadow-inner"
          />
          <span className="material-symbols-outlined text-base text-outline absolute left-3.5 top-2.5 pointer-events-none">
            search
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-on-surface-variant uppercase font-label-sm whitespace-nowrap font-semibold">Filter:</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-surface-container-lowest text-on-surface border border-outline-variant/40 text-xs py-2 px-3.5 rounded-full focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                    Retrieving orders ledger...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-outline">
                    No orders match your criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-surface-container transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-on-surface">{order.shippingName || order.user?.name || 'Customer'}</p>
                      <p className="text-[11px] text-outline">{order.shippingPhone || order.user?.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 font-semibold text-[10px] uppercase rounded-full ${orderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-on-surface">{order.paymentMethod}</span>
                      <span className="text-[10px] text-outline block">({order.paymentStatus})</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-primary font-serif">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full text-secondary hover:bg-secondary hover:text-on-secondary font-semibold transition-colors"
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
