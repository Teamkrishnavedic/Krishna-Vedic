import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function AddressesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get('/addresses');
      return res.data.addresses || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => api.post('/addresses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({ title: 'Address Saved', variant: 'success' });
      setShowAddForm(false);
      setFormData({
        fullName: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
      });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.response?.data?.message || 'Could not add address', variant: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({ title: 'Address Removed', variant: 'success' });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/addresses/${id}/set-default`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({ title: 'Default Destination Updated', variant: 'success' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast({ title: 'Invalid Phone', description: 'Enter a valid 10-digit number', variant: 'error' });
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast({ title: 'Invalid PIN Code', description: 'Enter a valid 6-digit PIN code', variant: 'error' });
      return;
    }
    addMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile py-12">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-outline-variant/30">
        <div>
          <Link to="/account" className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Account
          </Link>
          <h1 className="font-headline-lg text-headline-lg font-serif text-primary">Saved Addresses</h1>
          <p className="text-xs text-on-surface-variant mt-1">Manage delivery locations for rapid dispatch.</p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary hover:bg-secondary text-on-primary py-2 px-4 text-xs uppercase font-label-md tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span> Add New Address
          </button>
        )}
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="bg-surface-container-low p-6 border border-outline-variant/30 mb-8">
          <h2 className="font-serif text-lg font-bold text-primary mb-4 pb-2 border-b border-outline-variant/30">
            Add Delivery Address
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit number"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Street Address (House No, Building) *</label>
              <input
                type="text"
                required
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Apartment, Floor, Landmark (Optional)</label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="accent-primary"
              />
              <label htmlFor="isDefault" className="text-xs text-on-surface cursor-pointer">
                Set as default delivery address
              </label>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="bg-primary hover:bg-secondary text-on-primary py-2.5 px-6 font-label-md text-label-md uppercase tracking-wider font-semibold cursor-pointer transition-colors"
              >
                {addMutation.isPending ? 'Saving...' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-surface text-on-surface border border-outline-variant/40 py-2.5 px-5 font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {isLoading ? (
        <div className="p-8 text-center text-on-surface-variant font-serif">
          Loading addresses...
        </div>
      ) : addresses.length === 0 && !showAddForm ? (
        <div className="text-center py-12 bg-surface-container-low border border-outline-variant/30">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">location_off</span>
          <p className="text-on-surface font-serif font-bold">No saved addresses</p>
          <p className="text-xs text-on-surface-variant mt-1 mb-4">Add your shipping details for rapid checkout.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary text-on-primary px-6 py-2.5 font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer"
          >
            Add Address Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {addresses.map((addr: any) => (
            <div
              key={addr.id}
              className={`p-5 border flex flex-col justify-between ${
                addr.isDefault
                  ? 'border-primary bg-surface'
                  : 'border-outline-variant/30 bg-surface-container-low'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-on-surface text-sm">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-secondary text-on-secondary uppercase tracking-wider">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant">{addr.line1}</p>
                {addr.line2 && <p className="text-xs text-on-surface-variant">{addr.line2}</p>}
                <p className="text-xs text-on-surface-variant">{addr.city}, {addr.state} : {addr.pincode}</p>
                <p className="text-xs text-outline mt-2">Phone: {addr.phone}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/20 text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => setDefaultMutation.mutate(addr.id)}
                    className="text-secondary hover:underline font-semibold cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-outline">Default Destination</span>
                )}
                <button
                  onClick={() => deleteMutation.mutate(addr.id)}
                  className="text-outline hover:text-red-700 p-1 cursor-pointer"
                  title="Delete address"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
