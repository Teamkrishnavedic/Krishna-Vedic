import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search],
    queryFn: async () => {
      let url = `/admin/customers?limit=50`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      return res.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/customers/${id}/toggle-active`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      toast({ title: 'Customer Status Updated', variant: 'success' });
    },
  });

  const customers = data?.customers || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Registered Customers</h1>
        <p className="text-xs text-[#7d7567] mt-0.5">Manage customer directory, view order activity and status</p>
      </div>

      <div className="card p-5 border-[#e5e2da] bg-[#fafbf5] rounded-3xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email or phone..."
            className="input pl-10 pr-4 py-2.5 text-xs rounded-full shadow-inner"
          />
          <span className="material-symbols-outlined text-[#7d7567] text-base absolute left-3.5 top-2.5 pointer-events-none">search</span>
        </div>
      </div>

      <div className="card border-[#e5e2da] bg-[#fafbf5] overflow-hidden rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f4ec] border-b border-[#e5e2da] text-[#2d2a26] uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-center">Total Orders</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2da]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#7d7567] font-sans text-xs uppercase tracking-wider">
                    Loading customer data...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#7d7567]">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c: any) => (
                  <tr key={c.id} className="hover:bg-[#f4f4ec]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f4f4ec] text-[#2d2a26] border border-[#e5e2da] flex items-center justify-center font-bold text-xs shadow-inner">
                          {c.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-[#2d2a26]">{c.name}</p>
                          <p className="text-[11px] text-[#7d7567]">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4a463e]">
                      {c.phone || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-[#7d7567]">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#2d2a26]">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high font-semibold text-[11px]">
                        {c._count?.orders || 0} orders
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleMutation.mutate(c.id)}
                        className={`px-3 py-1 text-[10px] font-semibold border rounded-full transition-colors cursor-pointer ${
                          c.isActive
                            ? 'border-[#3f674f] text-[#3f674f] bg-[#eef5f1] hover:bg-red-50 hover:border-red-300 hover:text-red-800'
                            : 'border-red-300 text-red-800 bg-red-50 hover:bg-[#eef5f1] hover:border-[#3f674f] hover:text-[#3f674f]'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
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
