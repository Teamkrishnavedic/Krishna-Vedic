import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, isLoading } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 79900 || subtotal === 0 ? 0 : 7900; // Free above ₹799
  const finalTotal = Math.max(0, subtotal - couponDiscount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'VEDIC10') {
      const discount = Math.round(subtotal * 0.1);
      setCouponDiscount(discount);
      setAppliedCoupon('VEDIC10 (10% OFF)');
      toast({ title: 'Coupon Applied!', description: '10% discount applied to your order', variant: 'success' });
    } else {
      toast({ title: 'Invalid Coupon', description: 'Coupon code not valid or expired', variant: 'error' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-surface-container-high border border-outline-variant/30 flex items-center justify-center mx-auto mb-6 text-primary">
          <span className="material-symbols-outlined text-4xl">shopping_bag</span>
        </div>
        <h1 className="font-serif text-3xl text-on-surface mb-3">Your Basket is Empty</h1>
        <p className="text-on-surface-variant max-w-md mx-auto mb-8 text-sm">
          Looks like you haven't added any Vedic cold-pressed oils or fresh spices yet.
        </p>
        <Link
          to="/shop"
          className="bg-primary text-on-primary font-label-md text-label-md uppercase px-8 py-3.5 tracking-wider hover:bg-secondary transition-colors inline-flex items-center gap-2 font-semibold"
        >
          <span>Start Shopping</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile md:px-margin py-12">
      <div className="border-b border-outline-variant/30 pb-4 mb-8">
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">
          Shopping Basket ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Items List - 8 cols */}
        <div className="lg:col-span-8 divide-y divide-outline-variant/30 border-t border-b border-outline-variant/30">
          {items.map((item: any) => (
            <div key={item.id} className="py-6 flex gap-4 sm:gap-6 items-center">
              {/* Product Thumbnail */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-container-high overflow-hidden border border-outline-variant/30 flex-shrink-0">
                <img
                  src={item.variant?.product?.images?.[0] || 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=300&q=80'}
                  alt={item.variant?.product?.name || 'Product'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.variant?.product?.slug}`}
                  className="font-serif font-bold text-on-surface hover:text-primary line-clamp-1 text-base sm:text-lg transition-colors"
                >
                  {item.variant?.product?.name || 'Vedic Product'}
                </Link>
                <p className="text-xs text-on-surface-variant mt-0.5">Size: {item.variant?.name || item.variant?.title || 'Standard'}</p>
                <p className="text-sm font-bold text-primary mt-1 font-serif">
                  {formatPrice(item.price)}
                </p>

                {/* Mobile controls */}
                <div className="flex sm:hidden items-center justify-between mt-3">
                  <div className="flex items-center border border-outline-variant/40 bg-surface-container-low">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1.5 text-on-surface hover:text-primary cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-on-surface hover:text-primary cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-outline hover:text-primary p-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>

              {/* Desktop Quantity */}
              <div className="hidden sm:flex items-center border border-outline-variant/40 bg-surface-container-low">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="p-2 text-on-surface hover:text-primary cursor-pointer"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 text-on-surface hover:text-primary cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Line item total */}
              <div className="hidden sm:block text-right min-w-[5rem]">
                <p className="text-base font-bold text-primary font-serif">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              {/* Remove desktop */}
              <button
                onClick={() => removeItem(item.id)}
                className="hidden sm:block text-outline hover:text-primary p-2 transition-colors cursor-pointer"
                title="Remove item"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary - 4 cols */}
        <div className="lg:col-span-4 bg-surface-container-low p-6 sm:p-8 border border-outline-variant/30 space-y-6">
          <h2 className="font-serif text-xl text-primary font-bold border-b border-outline-variant/30 pb-3">
            Order Summary
          </h2>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE (E.G. VEDIC10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full bg-surface-container-lowest text-on-surface px-3 py-2 text-xs uppercase border border-outline-variant/40 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-secondary text-on-secondary text-xs uppercase font-label-md px-4 py-2 font-semibold hover:bg-primary transition-colors cursor-pointer whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-xs text-secondary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">sell</span> {appliedCoupon}
              </p>
            )}
          </form>

          {/* Breakdown */}
          <div className="space-y-2.5 text-sm text-on-surface-variant border-t border-b border-outline-variant/30 py-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-on-surface">{formatPrice(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-secondary font-semibold">
                <span>Discount</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-secondary font-bold">FREE</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-primary">
                Add {formatPrice(79900 - subtotal)} more to qualify for Free Shipping across Bharat!
              </p>
            )}
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="font-serif text-lg font-bold text-on-surface">Total</span>
            <span className="font-serif text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary hover:bg-secondary text-on-primary py-4 font-label-md text-label-md uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>

          <div className="space-y-2 pt-2 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">verified_user</span>
              <span>Safe &amp; 256-bit Encrypted Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">local_shipping</span>
              <span>Dispatched within 24 hours from cold mill</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
