import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice, formatDate, orderStatusColor } from '@/lib/utils';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: async () => {
      const res = await api.get(`/orders/${orderNumber}`);
      return res.data.order;
    },
    enabled: !!orderNumber,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-gutter-mobile py-20 text-center text-on-surface-variant font-serif text-lg">
        Validating order dispatch record...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile py-12">
      {/* Header status */}
      <div className="text-center pb-8 border-b border-outline-variant/30 mb-8 space-y-2">
        <div className="w-16 h-16 bg-surface-container-high border border-outline-variant/30 flex items-center justify-center mx-auto mb-4 text-secondary">
          <span className="material-symbols-outlined text-4xl">verified</span>
        </div>
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold block">
          Order Confirmed &amp; Dispatched to Mill
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">
          Thank You for Supporting Authentic Milling
        </h1>
        <p className="text-on-surface-variant text-sm max-w-lg mx-auto">
          We have received your order. Your cold-pressed bottles and spices will be sealed and handed to national express couriers within 24 hours.
        </p>
      </div>

      {/* Quick summary grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-surface-container-low border border-outline-variant/30 mb-8 text-xs">
        <div>
          <span className="text-outline block mb-1">Order Number</span>
          <span className="font-mono font-bold text-primary text-sm">{orderNumber}</span>
        </div>
        <div>
          <span className="text-outline block mb-1">Date</span>
          <span className="font-medium text-on-surface text-sm">
            {order?.createdAt ? formatDate(order.createdAt) : 'Today'}
          </span>
        </div>
        <div>
          <span className="text-outline block mb-1">Payment Mode</span>
          <span className="font-medium text-on-surface text-sm">
            {order?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}
          </span>
        </div>
        <div>
          <span className="text-outline block mb-1">Order Status</span>
          <span className={`inline-block px-2 py-0.5 font-semibold text-xs ${orderStatusColor(order?.status || 'PENDING')}`}>
            {order?.status || 'CONFIRMED'}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
        {/* Items List (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <h2 className="font-serif text-lg font-bold text-primary border-b border-outline-variant/30 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">shopping_bag</span>
            Items in this Consignment
          </h2>
          <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 bg-surface-container-low p-4">
            {order?.items?.map((item: any) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-on-surface">{item.productName}</p>
                  <p className="text-xs text-on-surface-variant">{item.variantName} × {item.quantity}</p>
                </div>
                <span className="font-bold text-primary font-serif">
                  {formatPrice(item.subtotal || item.priceSnapshot * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Totals (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-surface-container-low p-5 border border-outline-variant/30">
            <h3 className="font-serif text-base font-bold text-primary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">local_shipping</span>
              Shipping Destination
            </h3>
            {order && (
              <div className="text-xs text-on-surface-variant space-y-1">
                <p className="font-bold text-on-surface text-sm">{order.shippingName}</p>
                <p>{order.shippingLine1}</p>
                {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                <p>{order.shippingCity}, {order.shippingState} : {order.shippingPincode}</p>
                <p className="pt-1 text-outline">Phone: {order.shippingPhone}</p>
              </div>
            )}
          </div>

          <div className="bg-surface-container-low p-5 border border-outline-variant/30 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-semibold text-on-surface">{formatPrice(order?.subtotal || 0)}</span>
            </div>
            {order?.discountAmount > 0 && (
              <div className="flex justify-between text-secondary font-semibold">
                <span>Discount</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Shipping</span>
              <span className="font-semibold text-on-surface">
                {order?.shippingCharge === 0 ? 'FREE' : formatPrice(order?.shippingCharge || 0)}
              </span>
            </div>
            <div className="flex justify-between border-t border-outline-variant/30 pt-2 text-sm font-bold text-primary font-serif">
              <span>Total Amount</span>
              <span>{formatPrice(order?.total || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-outline-variant/30 pt-8">
        <Link
          to="/shop"
          className="bg-surface border border-outline-variant/40 text-on-surface px-6 py-3 font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container transition-colors cursor-pointer w-full sm:w-auto text-center"
        >
          Continue Shopping
        </Link>
        <Link
          to="/account/orders"
          className="bg-primary hover:bg-secondary text-on-primary px-8 py-3 font-label-md text-label-md uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
        >
          <span>View My Orders</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
