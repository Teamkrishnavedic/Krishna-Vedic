import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice, formatDate, orderStatusColor } from '@/lib/utils';

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-detail', orderNumber],
    queryFn: async () => {
      const res = await api.get(`/orders/${orderNumber}`);
      return res.data.order;
    },
    enabled: !!orderNumber,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-gutter-mobile py-12 text-center text-on-surface-variant font-serif">
        Retrieving order #{orderNumber} dispatch details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-gutter-mobile py-20 text-center space-y-3">
        <h1 className="font-serif text-2xl text-primary font-bold">Order Not Found</h1>
        <p className="text-on-surface-variant text-sm mb-4">Could not locate order #{orderNumber}.</p>
        <Link
          to="/account/orders"
          className="inline-block bg-primary text-on-primary px-6 py-2.5 font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile py-12">
      {/* Top back & actions */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-outline-variant/30">
        <div>
          <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Order #{order.orderNumber}
            </h1>
            <span className={`px-3 py-1 text-xs font-semibold ${orderStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-outline mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-surface border border-outline-variant/40 py-2 px-3 text-xs font-semibold text-on-surface hover:text-primary hover:bg-surface-container flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">print</span> Print Invoice
        </button>
      </div>

      {/* Status History Timeline */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="bg-surface-container-low p-5 border border-outline-variant/30 mb-8">
          <h2 className="text-xs uppercase font-bold tracking-wider text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">schedule</span>
            Order Tracking Timeline
          </h2>
          <div className="space-y-4 pl-2 border-l border-primary/40 ml-2">
            {order.statusHistory.map((h: any, idx: number) => (
              <div key={idx} className="relative pl-4">
                <div className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 bg-primary" />
                <p className="font-semibold text-on-surface text-sm">{h.status}</p>
                {h.note && <p className="text-xs text-on-surface-variant mt-0.5">{h.note}</p>}
                <p className="text-[11px] text-outline mt-0.5">{formatDate(h.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Items & Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
        {/* Items (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <h2 className="font-serif text-base font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-base">shopping_bag</span>
            Purchased Harvest Items
          </h2>
          <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 bg-surface-container-low p-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-on-surface">{item.productName}</p>
                  <p className="text-xs text-on-surface-variant">Variant: {item.variantName} • Qty: {item.quantity}</p>
                  <p className="text-xs text-outline">Unit Price: {formatPrice(item.priceSnapshot)}</p>
                </div>
                <span className="font-bold text-primary font-serif">
                  {formatPrice(item.subtotal || item.priceSnapshot * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Pricing (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-surface-container-low p-5 border border-outline-variant/30">
            <h2 className="font-serif text-base font-bold text-primary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">local_shipping</span>
              Shipping Destination
            </h2>
            <div className="text-xs text-on-surface-variant space-y-1">
              <p className="font-bold text-on-surface text-sm">{order.shippingName}</p>
              <p>{order.shippingLine1}</p>
              {order.shippingLine2 && <p>{order.shippingLine2}</p>}
              <p>{order.shippingCity}, {order.shippingState} : {order.shippingPincode}</p>
              <p className="pt-1 text-outline">Contact: {order.shippingPhone}</p>
            </div>
          </div>

          <div className="bg-surface-container-low p-5 border border-outline-variant/30 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-semibold text-on-surface">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-secondary font-semibold">
                <span>Discount</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Shipping</span>
              <span className="font-semibold text-on-surface">
                {order.shippingCharge === 0 ? 'FREE' : formatPrice(order.shippingCharge)}
              </span>
            </div>
            <div className="flex justify-between border-t border-outline-variant/30 pt-2 text-sm font-bold text-primary font-serif">
              <span>Total Amount</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="pt-2 text-[11px] text-outline text-center">
              Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'} ({order.paymentStatus})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
