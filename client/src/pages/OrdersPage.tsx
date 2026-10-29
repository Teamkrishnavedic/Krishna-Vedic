import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice, formatDate, orderStatusColor } from '@/lib/utils';

export default function OrdersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', page],
    queryFn: async () => {
      const res = await api.get(`/orders?page=${page}&limit=10`);
      return res.data;
    },
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-gutter-mobile md:px-margin py-12">
      <div className="mb-6">
        <Link to="/account" className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Account
        </Link>
        <h1 className="font-headline-lg text-headline-lg font-serif text-primary">My Orders</h1>
        <p className="text-xs text-on-surface-variant mt-1">Review and track all your previous harvest lot purchases.</p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-on-surface-variant font-serif text-lg border border-outline-variant/30 bg-surface-container-low">
          Retrieving order dispatches...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low border border-outline-variant/30 space-y-3">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">package_2</span>
          <h2 className="font-serif text-2xl text-on-surface">No Orders Found</h2>
          <p className="text-on-surface-variant text-xs mb-4">You have not placed any orders with Krishna Vedic yet.</p>
          <Link
            to="/shop"
            className="inline-block bg-primary text-on-primary px-6 py-2.5 font-label-md text-label-md uppercase tracking-wider hover:bg-secondary transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-surface-container-low p-5 border border-outline-variant/30 hover:border-primary transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-outline-variant/20 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-primary text-base">
                    {order.orderNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold ${orderStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-outline">
                  Ordered on {formatDate(order.createdAt)}
                </div>
              </div>

              {/* Items row */}
              <div className="py-4 space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-on-surface">
                      {item.productName} <span className="text-xs text-on-surface-variant">({item.variantName} × {item.quantity})</span>
                    </span>
                    <span className="font-bold text-primary font-serif">
                      {formatPrice(item.subtotal || item.priceSnapshot * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom footer */}
              <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20 text-sm">
                <div>
                  <span className="text-xs text-on-surface-variant">Total: </span>
                  <span className="font-bold text-primary font-serif">{formatPrice(order.total)}</span>
                  <span className="text-xs text-outline ml-2">({order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'})</span>
                </div>
                <Link
                  to={`/account/orders/${order.orderNumber}`}
                  className="bg-surface border border-outline-variant/40 py-1.5 px-4 text-xs font-semibold text-primary hover:bg-surface-container transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  View Order <span className="material-symbols-outlined text-sm">open_in_new</span>
                </Link>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination && Math.ceil(pagination.total / pagination.limit) > 1 && (
            <div className="flex justify-center gap-2 pt-6">
              {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 text-xs font-medium border cursor-pointer ${
                    p === page ? 'bg-primary text-on-primary border-primary font-bold' : 'bg-surface text-on-surface border-outline-variant/30 hover:bg-surface-container'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
