import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Address form state
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  // Keep recipient name and phone synced when user profile loads
  useEffect(() => {
    if (user?.name && !newAddress.fullName) {
      setNewAddress((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Fetch saved user addresses
  const { data: addresses = [] } = useQuery<any[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get('/addresses');
      return res.data.addresses || [];
    },
  });

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    } else if (addresses.length === 0) {
      setUseNewAddress(true);
    }
  }, [addresses, selectedAddressId]);

  // Server validation of cart & pricing
  const { data: preview } = useQuery({
    queryKey: ['checkout-preview', cart?.items],
    queryFn: async () => {
      const res = await api.post('/checkout/validate', {});
      return res.data;
    },
    enabled: !!cart && cart.items.length > 0,
  });

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (useNewAddress || !selectedAddressId) {
      if (!newAddress.fullName.trim() || newAddress.fullName.trim().length < 2) {
        toast({
          title: 'Recipient Name Required',
          description: 'Please enter the delivery recipient full name.',
          variant: 'error',
        });
        return;
      }
      if (!/^[6-9]\d{9}$/.test(newAddress.phone.trim())) {
        toast({
          title: 'Valid Mobile Number Required',
          description: 'Please enter a valid 10-digit Indian mobile number for courier SMS updates.',
          variant: 'error',
        });
        return;
      }
      if (!newAddress.line1.trim() || newAddress.line1.trim().length < 5) {
        toast({
          title: 'Street Address Required',
          description: 'Please provide flat/door number and street address (minimum 5 characters).',
          variant: 'error',
        });
        return;
      }
      if (!newAddress.city.trim() || !newAddress.state.trim()) {
        toast({
          title: 'City & State Required',
          description: 'Please enter both city and state for delivery.',
          variant: 'error',
        });
        return;
      }
      if (!/^\d{6}$/.test(newAddress.pincode.trim())) {
        toast({
          title: 'Invalid PIN Code',
          description: 'Please enter a valid 6-digit postal PIN code.',
          variant: 'error',
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const idempotencyKey = nanoid();

      let targetAddressId = selectedAddressId;
      if (useNewAddress || !selectedAddressId) {
        const addrRes = await api.post('/addresses', newAddress);
        targetAddressId = addrRes.data.address.id;
      }

      const orderPayload = {
        addressId: targetAddressId,
        paymentMethod,
        deliveryInstructions,
      };

      const res = await api.post('/checkout/place-order', orderPayload, {
        headers: { 'X-Idempotency-Key': idempotencyKey },
      });

      const order = res.data.order;
      toast({
        title: 'Order Placed Successfully',
        description: `Order #${order.orderNumber} confirmed.`,
        variant: 'success',
      });

      await refreshCart();
      navigate(`/order-confirmation/${order.orderNumber || order.id}`);
    } catch (err: any) {
      toast({
        title: 'Checkout Failed',
        description: err.response?.data?.message || err.message || 'Could not process order. Please retry.',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const items = cart?.items || [];

  if (!cart || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-on-surface mb-3">Your Basket is Empty</h1>
        <p className="text-on-surface-variant max-w-md mx-auto mb-8 text-sm">
          You need items in your basket before checking out.
        </p>
        <Link
          to="/shop"
          className="bg-primary text-on-primary font-label-md text-label-md uppercase px-8 py-3.5 tracking-wider hover:bg-secondary transition-colors inline-block font-semibold"
        >
          Explore Harvest Range
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile md:px-margin py-12">
      <div className="border-b border-outline-variant/30 pb-4 mb-8">
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">
          Direct Mill Checkout
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Review your dispatch destination and finalize your pure harvest lot order.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Delivery & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Delivery Address */}
            <div className="bg-surface-container-low p-6 border border-outline-variant/30">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/30">
                <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-primary">location_on</span>
                  1. Delivery Address
                </h2>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseNewAddress(!useNewAddress)}
                    className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
                  >
                    {useNewAddress ? 'Select Saved Address' : '+ Add New Address'}
                  </button>
                )}
              </div>

              {!useNewAddress && addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr: any) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                        selectedAddressId === addr.id
                          ? 'border-primary bg-surface'
                          : 'border-outline-variant/30 bg-surface-container hover:border-primary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingAddress"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-primary"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-on-surface">
                          {addr.fullName} <span className="font-normal text-on-surface-variant">({addr.phone})</span>
                        </p>
                        <p className="text-on-surface-variant mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p className="text-on-surface-variant">{addr.city}, {addr.state} : {addr.pincode}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="input"
                        placeholder="e.g. Ramesh Sharma"
                      />
                    </div>
                    <div>
                      <label className="label">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="input"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Address (House No., Building, Street) *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                      className="input"
                      placeholder="e.g. 42 Vedic Marg, Near Temple"
                    />
                  </div>

                  <div>
                    <label className="label">Apartment, Suite, Landmark (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.line2}
                      onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="label">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">PIN Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="input"
                        placeholder="6 digits"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery instructions */}
              <div className="mt-4 pt-4 border-t border-outline-variant/30">
                <label className="label">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Leave with building desk, handle glass with care"
                  className="input text-xs"
                />
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-surface-container-low p-6 border border-outline-variant/30">
              <h2 className="font-serif text-lg font-bold text-primary mb-4 pb-3 border-b border-outline-variant/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-primary">credit_card</span>
                2. Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === 'COD'
                      ? 'border-primary bg-surface'
                      : 'border-outline-variant/30 bg-surface-container hover:border-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <p className="font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-secondary">payments</span>
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Pay in cash or UPI QR upon courier arrival at your doorstep.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === 'ONLINE'
                      ? 'border-primary bg-surface'
                      : 'border-outline-variant/30 bg-surface-container hover:border-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <p className="font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-secondary">account_balance</span>
                      Prepaid Online Payment (UPI, Cards, NetBanking)
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Instant 256-bit encrypted checkout via Razorpay with SMS receipt.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Submit (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-low p-6 sm:p-8 border border-outline-variant/30 space-y-6">
            <h2 className="font-serif text-xl text-primary font-bold border-b border-outline-variant/30 pb-3">
              Your Harvest Order
            </h2>

            {/* Items summary */}
            <div className="divide-y divide-outline-variant/20 max-h-60 overflow-y-auto pr-1">
              {items.map((item: any) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                  <div className="pr-4">
                    <p className="font-medium text-on-surface line-clamp-1">{item.variant?.product?.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {item.variant?.name || item.variant?.title || 'Standard'} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-primary whitespace-nowrap font-serif">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing totals */}
            <div className="space-y-2 text-sm text-on-surface-variant border-t border-b border-outline-variant/30 py-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-on-surface">{formatPrice(preview?.subtotal || cart?.subtotal || 0)}</span>
              </div>
              {preview?.discountAmount > 0 && (
                <div className="flex justify-between text-secondary font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(preview.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {(preview?.shippingCharge === 0) ? (
                    <span className="text-secondary font-bold">FREE</span>
                  ) : (
                    formatPrice(preview?.shippingCharge || 7900)
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-serif text-lg font-bold text-on-surface">Final Total</span>
              <span className="font-serif text-2xl font-bold text-primary">
                {formatPrice(preview?.total || (cart?.subtotal || 0))}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-secondary text-on-primary py-4 font-label-md text-label-md uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
            </button>

            <div className="space-y-2 pt-2 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-secondary">verified_user</span>
                <span>100% Genuine Vedic Products Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-secondary">local_shipping</span>
                <span>Express Dispatch with SMS &amp; WhatsApp Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
