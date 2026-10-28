import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: 'Krishnavedic Oil & Masalas',
    announcement_text: 'Pure Wood-Pressed Oils & Stone-Ground Masalas • 100% Vedic Guarantee',
    support_email: 'support@krishnavedic.com',
    support_phone: '+91 98765 43210',
    mill_address: 'Vedic Heritage Complex, Industrial Area Phase II, Jaipur, Rajasthan - 302013',
    free_shipping_threshold: '500',
    upi_id: 'krishnavedic@upi',
  });

  const { data } = useQuery({
    queryKey: ['admin-store-settings'],
    queryFn: async () => {
      const res = await api.get('/admin/settings');
      return res.data.settings || {};
    },
  });

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setSettings((prev) => ({ ...prev, ...data }));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, string>) =>
      api.put('/admin/settings', { settings: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-store-settings'] });
      toast({ title: 'Settings Saved', description: 'Store configuration updated', variant: 'success' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || err.response?.data?.error || 'Could not save settings', variant: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(settings);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#e5e2da]">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Store Settings & Profile</h1>
          <p className="text-xs text-[#7d7567] mt-0.5">Configure store info, announcement banners, and support lines</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saveMutation.isPending}
          className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 rounded-full shadow-sm cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">save</span>
          {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Store Details */}
        <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] space-y-4 rounded-3xl shadow-sm">
          <h2 className="font-serif text-base font-bold text-[#2d2a26] mb-2 pb-2 border-b border-[#e5e2da] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6e3418] text-base">storefront</span> General Store Information
          </h2>

          <div>
            <label className="label">Store Title</label>
            <input
              type="text"
              value={settings.store_name || ''}
              onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
              className="input text-xs rounded-xl"
            />
          </div>

          <div>
            <label className="label">Storefront Announcement Banner Message</label>
            <input
              type="text"
              value={settings.announcement_text || ''}
              onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
              className="input text-xs rounded-xl"
            />
          </div>

          <div>
            <label className="label">Free Shipping Minimum Threshold (₹)</label>
            <input
              type="number"
              value={settings.free_shipping_threshold || '500'}
              onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
              className="input text-xs w-36 font-bold rounded-xl"
            />
          </div>
        </div>

        {/* Contact and Location */}
        <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] space-y-4 rounded-3xl shadow-sm">
          <h2 className="font-serif text-base font-bold text-[#2d2a26] mb-2 pb-2 border-b border-[#e5e2da] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6e3418] text-base">mail</span> Customer Support & Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Official Support Email</label>
              <input
                type="email"
                value={settings.support_email || ''}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="input text-xs rounded-xl"
              />
            </div>
            <div>
              <label className="label">Customer Care Mobile / WhatsApp</label>
              <input
                type="tel"
                value={settings.support_phone || ''}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                className="input text-xs rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="label">Production Oil Mill / Registered Address</label>
            <textarea
              rows={2}
              value={settings.mill_address || ''}
              onChange={(e) => setSettings({ ...settings, mill_address: e.target.value })}
              className="input text-xs rounded-xl"
            />
          </div>

          <div>
            <label className="label">Merchant UPI ID (for manual payment verification)</label>
            <input
              type="text"
              value={settings.upi_id || ''}
              onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
              className="input text-xs font-mono rounded-xl"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
