import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
  onClose: () => void;
}

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const { cart, isLoading, updateItem, removeItem } = useCart();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-surface-container-lowest z-50 flex flex-col border-l border-outline-variant/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">shopping_bag</span>
            <h2 className="font-serif text-lg text-primary font-bold">Shopping Basket</h2>
            {cart && cart.items.length > 0 && (
              <span className="text-xs text-on-surface-variant font-label-sm">
                ({cart.items.length} items)
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="w-16 h-16 bg-surface-container-high flex items-center justify-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-3xl text-outline">shopping_bag</span>
              </div>
              <div>
                <p className="font-serif font-bold text-on-surface mb-1">Your basket is empty</p>
                <p className="text-xs text-on-surface-variant">Add small-batch oils or stone-ground masalas to get started</p>
              </div>
              <button
                onClick={onClose}
                className="bg-primary text-on-primary font-label-md text-label-md uppercase px-6 py-2.5 hover:bg-secondary transition-colors cursor-pointer font-semibold"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5">
                  {/* Image */}
                  <div className="w-16 h-16 bg-surface-container-high border border-outline-variant/30 overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl text-outline">shopping_bag</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.productSlug}`}
                      onClick={onClose}
                      className="text-sm font-serif font-bold text-on-surface hover:text-primary line-clamp-1 transition-colors"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-on-surface-variant mt-0.5">{item.variantName}</p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-outline-variant/40 bg-surface-container-low">
                        <button
                          className="w-7 h-7 flex items-center justify-center text-on-surface hover:text-primary cursor-pointer disabled:opacity-40"
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-on-surface">
                          {item.quantity}
                        </span>
                        <button
                          className="w-7 h-7 flex items-center justify-center text-on-surface hover:text-primary cursor-pointer disabled:opacity-40"
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-primary font-serif">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-outline hover:text-primary transition-colors self-start cursor-pointer"
                    disabled={isLoading}
                    aria-label="Remove item"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-outline-variant/30 p-5 space-y-4 bg-surface-container-low">
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Subtotal</span>
              <span className="font-bold text-primary text-base font-serif">
                {formatPrice(cart.subtotal)}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Shipping and statutory GST calculated at checkout.</p>
            <div className="flex flex-col gap-2">
              <Link
                to="/checkout"
                onClick={onClose}
                className="bg-primary text-on-primary py-3 font-label-md text-label-md uppercase tracking-wider text-center font-semibold hover:bg-secondary transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="bg-transparent text-primary border border-primary py-2.5 font-label-md text-label-md uppercase tracking-wider text-center font-semibold hover:bg-primary hover:text-on-primary transition-colors"
              >
                View Full Basket
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
