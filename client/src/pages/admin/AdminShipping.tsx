import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminShipping() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Standard Pan-India Delivery',
    minOrderValue: 0,
    maxOrderValue: 500,
    charge: 49,
    estimatedDays: '3-5 Business Days',
    isActive: true,
  });

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['admin-shipping-rules'],
    queryFn: async () => {
      const res = await api.get('/admin/shipping-rules');
      return res.data.rules || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = {
        name: data.name,
        minOrderValue: data.minOrderValue * 100,
        maxOrderValue: data.maxOrderValue ? data.maxOrderValue * 100 : undefined,
        charge: data.charge * 100,
        estimatedDays: data.estimatedDays,
        isActive: data.isActive,
      };
      return api.post('/admin/shipping-rules', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-rules'] });
      toast({ title: 'Shipping Rule Added', variant: 'success' });
      setShowForm(false);
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || err.response?.data?.error || 'Could not save shipping rule', variant: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/shipping-rules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-rules'] });
      toast({ title: 'Rule Deleted', variant: 'success' });
    },
    onError: (err: any) => {
      toast({ title: 'Delete Failed', description: err.message || err.response?.data?.error || 'Could not delete shipping rule', variant: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Shipping Rules & Rates</h1>
          <p className="text-xs text-[#7d7567] mt-0.5">Configure free shipping thresholds and regional transit charges</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1.5 rounded-full shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span> Add Shipping Tier
          </button>
        )}
      </div>

      {showForm && (
        <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] mb-6 rounded-3xl shadow-sm">
          <h2 className="font-serif text-base font-bold text-[#2d2a26] mb-4 pb-2 border-b border-[#e5e2da]">
            Create Shipping Rule Tier
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Rule Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input text-xs rounded-xl"
                />
              </div>
              <div>
                <label className="label">Estimated Days</label>
                <input
                  type="text"
                  value={formData.estimatedDays}
                  onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                  placeholder="e.g. 3-5 Business Days"
                  className="input text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Min Order Value (₹) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: parseInt(e.target.value) || 0 })}
                  className="input text-xs rounded-xl"
                />
              </div>
              <div>
                <label className="label">Max Order Value (₹)</label>
                <input
                  type="number"
                  value={formData.maxOrderValue || ''}
                  onChange={(e) => setFormData({ ...formData, maxOrderValue: parseInt(e.target.value) || 0 })}
                  className="input text-xs rounded-xl"
                  placeholder="Leave empty for unlimited (e.g. above 500)"
                />
              </div>
              <div>
                <label className="label">Delivery Charge (₹) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.charge}
                  onChange={(e) => setFormData({ ...formData, charge: parseInt(e.target.value) || 0 })}
                  className="input text-xs font-bold rounded-xl"
                  placeholder="0 for Free Delivery"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-primary py-2.5 px-6 text-xs rounded-full cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Rule'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost py-2.5 px-4 text-xs rounded-full cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules Table */}
      <div className="card border-[#e5e2da] bg-[#fafbf5] overflow-hidden rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f4ec] border-b border-[#e5e2da] text-[#2d2a26] uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Tier Name</th>
                <th className="py-3.5 px-4">Order Value Range</th>
                <th className="py-3.5 px-4">Shipping Charge</th>
                <th className="py-3.5 px-4">Transit Time</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2da]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#7d7567] font-sans text-xs uppercase tracking-wider">
                    Loading shipping rules...
                  </td>
                </tr>
              ) : rules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#7d7567]">
                    No custom rules set. Default standard shipping applies.
                  </td>
                </tr>
              ) : (
                rules.map((r: any) => (
                  <tr key={r.id} className="hover:bg-[#f4f4ec]/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#2d2a26]">
                      {r.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#4a463e]">
                      {formatPrice(r.minOrderValue)}
                      {r.maxOrderValue ? ` - ${formatPrice(r.maxOrderValue)}` : ' and above'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2d2a26]">
                      {r.charge === 0 ? (
                        <span className="text-[#3f674f]">FREE SHIPPING</span>
                      ) : (
                        formatPrice(r.charge)
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#7d7567]">
                      {r.estimatedDays || '3-5 days'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 border font-semibold text-[10px] rounded-full ${
                        r.isActive ? 'border-[#3f674f] text-[#3f674f] bg-[#eef5f1]' : 'border-[#e5e2da] text-[#7d7567] bg-[#f4f4ec]'
                      }`}>
                        {r.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete rule "${r.name}"?`)) {
                            deleteMutation.mutate(r.id);
                          }
                        }}
                        className="p-1 text-[#7d7567] hover:text-red-700"
                        title="Delete rule"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
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
