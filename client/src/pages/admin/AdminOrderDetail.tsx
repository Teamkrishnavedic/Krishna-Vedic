import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice, formatDate, orderStatusColor } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order-detail', id],
    queryFn: async () => {
      const res = await api.get(`/admin/orders/${id}`);
      return res.data.order;
    },
    enabled: !!id,
  });

  React.useEffect(() => {
    if (order && !newStatus) setNewStatus(order.status);
  }, [order, newStatus]);

  const updateStatusMutation = useMutation({
    mutationFn: (payload: { status: string; note?: string }) =>
      api.patch(`/admin/orders/${id}/status`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order-detail', id] });
      toast({ title: 'Status Updated', description: `Order status changed to ${newStatus}`, variant: 'success' });
      setStatusNote('');
    },
    onError: (err: any) => {
      toast({ title: 'Update Failed', description: err.message || err.response?.data?.error || 'Could not update status', variant: 'error' });
    },
  });

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;
    updateStatusMutation.mutate({
      status: newStatus,
      note: statusNote.trim() || undefined,
    });
  };

  if (isLoading) {
    return <div className="py-20 text-center text-on-surface-variant font-serif">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="font-serif text-2xl text-primary font-bold">Order Not Found</h2>
        <Link to="/admin/orders" className="inline-block bg-primary text-on-primary px-6 py-2 text-xs uppercase font-label-md font-semibold">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
        <div>
          <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-headline-lg font-serif text-primary">
              Order #{order.orderNumber}
            </h1>
            <span className={`px-2.5 py-0.5 text-xs font-semibold ${orderStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-outline mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-surface border border-outline-variant/40 py-2 px-3 text-xs font-semibold text-on-surface hover:text-primary hover:bg-surface-container flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">print</span> Print Packing Slip
        </button>
      </div>

      {/* Status Update Card */}
      <div className="bg-surface-container-low p-6 border border-outline-variant/30 rounded-3xl shadow-sm">
        <h2 className="font-serif text-sm font-bold text-primary mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">schedule</span>
          Update Order Status &amp; Fulfillment
        </h2>
        <form onSubmit={handleStatusSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:w-48">
            <label className="text-[11px] font-semibold text-on-surface block mb-1">New Status</label>
            <select
              value={newStatus || order.status}
              onChange={(e) => setNewStatus(e.target.value)}
              className="bg-surface-container-lowest text-on-surface border border-outline-variant/40 text-xs py-2 px-3.5 w-full rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="PACKED">PACKED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="text-[11px] font-semibold text-on-surface block mb-1">Status Note (Optional)</label>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Dispatched via BlueDart AWB #12345678"
              className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/40 text-xs py-2 px-3.5 rounded-xl focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={updateStatusMutation.isPending}
            className="btn-primary py-2.5 px-6 text-xs uppercase font-label-md tracking-wider font-semibold whitespace-nowrap self-stretch sm:self-auto rounded-full cursor-pointer disabled:opacity-50"
          >
            {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
          </button>
        </form>
      </div>

      {/* Grid: Items & Shipping */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Items (7 cols) */}
        <div className="md:col-span-7 bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-outline-variant/30 font-serif font-bold text-primary text-sm">
            Ordered Items ({order.items?.length || 0})
          </div>
          <div className="divide-y divide-outline-variant/20">
            {order.items?.map((item: any) => {
              const itemImg = item.product?.images?.[0]?.url || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80';
              return (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={typeof itemImg === 'string' ? itemImg : (itemImg?.url || '')}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover border border-outline-variant/30 bg-surface-container shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <div>
                      <p className="font-bold text-on-surface">{item.productName}</p>
                      <p className="text-on-surface-variant text-[11px]">Variant: {item.variantName} • SKU: {item.sku}</p>
                      <p className="text-outline text-[11px]">Qty: {item.quantity} × {formatPrice(item.priceSnapshot)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary text-sm font-serif shrink-0">
                    {formatPrice(item.subtotal || item.priceSnapshot * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-5 bg-surface-container-high border-t border-outline-variant/30 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-semibold text-on-surface">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-secondary font-semibold">
                <span>Coupon Discount ({order.couponCode || 'PROMO'})</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Shipping Charge</span>
              <span className="font-semibold text-on-surface">{formatPrice(order.shippingCharge)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-primary border-t border-outline-variant/30 pt-2 font-serif">
              <span>Grand Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Address (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-surface-container-low p-6 border border-outline-variant/30 rounded-3xl shadow-sm text-xs space-y-2">
            <h3 className="font-serif text-sm font-bold text-primary border-b border-outline-variant/30 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">local_shipping</span>
              Shipping Destination
            </h3>
            <p className="font-bold text-on-surface text-sm pt-1">{order.shippingName}</p>
            <p className="text-on-surface-variant">{order.shippingLine1}</p>
            {order.shippingLine2 && <p className="text-on-surface-variant">{order.shippingLine2}</p>}
            <p className="text-on-surface-variant">{order.shippingCity}, {order.shippingState} - {order.shippingPincode}</p>
            <p className="text-outline font-medium pt-1">Phone: {order.shippingPhone}</p>
            {order.deliveryInstructions && (
              <div className="mt-3 p-3 bg-surface-container rounded-2xl border border-outline-variant/20 text-on-surface text-[11px]">
                <strong>Instructions:</strong> {order.deliveryInstructions}
              </div>
            )}
          </div>

          {/* Audit History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-surface-container-low p-6 border border-outline-variant/30 rounded-3xl shadow-sm">
              <h3 className="font-serif text-sm font-bold text-primary mb-3 border-b border-outline-variant/30 pb-2">
                Order History Timeline
              </h3>
              <div className="space-y-3 text-xs">
                {order.statusHistory.map((h: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-primary pl-3">
                    <p className="font-bold text-on-surface">{h.status}</p>
                    {h.note && <p className="text-on-surface-variant text-[11px]">{h.note}</p>}
                    <p className="text-[10px] text-outline">{formatDate(h.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
