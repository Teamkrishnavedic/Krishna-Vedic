import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function AdminReports() {
  const { data } = useQuery({
    queryKey: ['admin-reports-sales'],
    queryFn: async () => {
      const res = await api.get('/admin/reports/sales');
      return res.data;
    },
  });

  const revenue = data?.revenue || 0;
  const orderCount = data?.orderCount || 0;
  const aov = orderCount > 0 ? Math.round(revenue / orderCount) : 0;
  const topProducts = data?.topProducts || [];
  const statusCounts = data?.ordersByStatus || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Analytics & Sales Reports</h1>
        <p className="text-xs text-[#7d7567] mt-0.5">30-day trailing revenue performance, top items, and volume</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7d7567]">Gross Sales</span>
            <div className="w-9 h-9 rounded-full border border-[#e5e2da] bg-[#f4f4ec] text-[#3f674f] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-base">trending_up</span>
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#2d2a26] mt-3">
            {formatPrice(revenue)}
          </p>
          <p className="text-xs text-[#7d7567] mt-1">Paid orders in selected period</p>
        </div>

        <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7d7567]">Paid Orders Count</span>
            <div className="w-9 h-9 rounded-full border border-[#e5e2da] bg-[#f4f4ec] text-[#6e3418] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-base">shopping_bag</span>
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#2d2a26] mt-3">
            {orderCount}
          </p>
          <p className="text-xs text-[#7d7567] mt-1">Completed checkout sessions</p>
        </div>

        <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7d7567]">Average Order Value</span>
            <div className="w-9 h-9 rounded-full border border-[#e5e2da] bg-[#f4f4ec] text-[#594100] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-base">currency_rupee</span>
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#2d2a26] mt-3">
            {formatPrice(aov)}
          </p>
          <p className="text-xs text-[#7d7567] mt-1">Per transaction basket average</p>
        </div>
      </div>

      {/* Top Products Table & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Top 10 Products (8 cols) */}
        <div className="lg:col-span-8 card border-[#e5e2da] bg-[#fafbf5] overflow-hidden rounded-3xl shadow-sm">
          <div className="p-5 border-b border-[#e5e2da] font-serif font-bold text-[#2d2a26] text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6e3418] text-base">inventory_2</span> Bestselling Vedic Products (by Revenue)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f4ec] border-b border-[#e5e2da] text-[#2d2a26] uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4 text-center">Units Sold</th>
                  <th className="py-3.5 px-4 text-right">Gross Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2da]">
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-[#7d7567]">
                      No sales data recorded yet.
                    </td>
                  </tr>
                ) : (
                  topProducts.map((p: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#f4f4ec]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#6e3418]">
                        #{idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2d2a26]">
                        {p.productName}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-[#4a463e]">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high font-semibold text-[11px]">
                          {p._sum?.quantity || 0} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#2d2a26]">
                        {formatPrice(p._sum?.subtotal || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Volume by Status (4 cols) */}
        <div className="lg:col-span-4 card border-[#e5e2da] bg-[#fafbf5] overflow-hidden rounded-3xl shadow-sm">
          <div className="p-5 border-b border-[#e5e2da] font-serif font-bold text-[#2d2a26] text-sm">
            Orders by Current Status
          </div>
          <div className="p-5 space-y-3">
            {statusCounts.map((sc: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-[#e5e2da]/60">
                <span className="font-medium text-[#4a463e]">{sc.status}</span>
                <span className="font-bold text-[#2d2a26] bg-[#f4f4ec] border border-[#e5e2da] px-3 py-0.5 rounded-full text-[11px]">
                  {sc._count} orders
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
