import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, Mail, Phone, MapPin, Save, MessageSquare, Truck, CreditCard } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: 'Krishna Vedic',
    announcement_text: 'अब खाएंगे दादी-दादी के ज़माने का तेल और मसाले',
    support_email: 'krishnavedic001@gmail.com',
    support_phone: '+91 7976123348',
    whatsapp_number: '+91 7976123348',
    mill_address: 'Vedic Heritage Complex, Industrial Area Phase II, Jaipur, Rajasthan - 302022, India',
    free_shipping_threshold: '799',
    upi_id: 'krishnavedic001@okaxis',
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
      queryClient.invalidateQueries({ queryKey: ['store-settings-public'] });
      toast({
        title: 'Settings Saved',
        description: 'Store details and contact numbers updated across website',
        variant: 'success',
      });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err.message || err.response?.data?.error || 'Could not save settings',
        variant: 'error',
      });
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
          <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Store Settings &amp; Profile</h1>
          <p className="text-xs text-[#7d7567] mt-0.5">
            Manage your store title, contact numbers, address, and live ticker directly
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saveMutation.isPending}
          className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 rounded-full shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saveMutation.isPending ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Store Details */}
        <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] space-y-4 rounded-3xl shadow-sm">
          <h2 className="font-serif text-base font-bold text-[#2d2a26] mb-2 pb-2 border-b border-[#e5e2da] flex items-center gap-2">
            <Store className="w-4 h-4 text-[#6e3418]" />
            <span>General Store Information</span>
          </h2>

          <div>
            <label className="label">Store Title / Brand Name</label>
            <input
              type="text"
              value={settings.store_name || ''}
              onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
              className="input text-xs rounded-xl"
              placeholder="Krishna Vedic"
            />
          </div>

          <div>
            <label className="label">Top Announcement Banner / Tagline (Hindi or English)</label>
            <input
              type="text"
              value={settings.announcement_text || ''}
              onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
              className="input text-xs rounded-xl"
              placeholder="अब खाएंगे दादी-दादी के ज़माने का तेल और मसाले"
            />
            <p className="text-[11px] text-[#7d7567] mt-1">Appears on the top ticker bar across the whole website.</p>
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#3f674f]" />
              <span>Free Shipping Minimum Threshold (₹)</span>
            </label>
            <input
              type="number"
              value={settings.free_shipping_threshold || '799'}
              onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
              className="input text-xs w-36 font-bold rounded-xl"
            />
          </div>
        </div>

        {/* Contact and Location */}
        <div className="card p-6 border-[#e5e2da] bg-[#fafbf5] space-y-4 rounded-3xl shadow-sm">
          <h2 className="font-serif text-base font-bold text-[#2d2a26] mb-2 pb-2 border-b border-[#e5e2da] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#6e3418]" />
            <span>Customer Support &amp; Direct WhatsApp</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#7d7567]" />
                <span>Official Support Email</span>
              </label>
              <input
                type="email"
                value={settings.support_email || ''}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="input text-xs rounded-xl"
                placeholder="krishnavedic001@gmail.com"
              />
            </div>

            <div>
              <label className="label flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#7d7567]" />
                <span>Customer Care Mobile Number</span>
              </label>
              <input
                type="tel"
                value={settings.support_phone || ''}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                className="input text-xs rounded-xl"
                placeholder="+91 7976123348"
              />
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-1 text-[#25D366]">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Inquiries Number (For 1-Click WhatsApp Chat)</span>
            </label>
            <input
              type="tel"
              value={settings.whatsapp_number || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="input text-xs rounded-xl"
              placeholder="+91 7976123348"
            />
            <p className="text-[11px] text-[#7d7567] mt-1">Customers clicking WhatsApp will open chat with this number.</p>
          </div>

          <div>
            <label className="label flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#7d7567]" />
              <span>Production Oil Mill / Store Address</span>
            </label>
            <textarea
              rows={2}
              value={settings.mill_address || ''}
              onChange={(e) => setSettings({ ...settings, mill_address: e.target.value })}
              className="input text-xs rounded-xl"
              placeholder="Vedic Heritage Complex, Industrial Area Phase II, Jaipur, Rajasthan - 302022, India"
            />
          </div>

          <div>
            <label className="label flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-[#7d7567]" />
              <span>Merchant UPI ID (for manual payment verification)</span>
            </label>
            <input
              type="text"
              value={settings.upi_id || ''}
              onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
              className="input text-xs font-mono rounded-xl"
              placeholder="krishnavedic001@okaxis"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
