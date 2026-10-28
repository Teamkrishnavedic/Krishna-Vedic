import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';

interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  stock: number;
  variantName: string;
  sku: string;
  productName: string;
  productSlug: string;
  imageUrl?: string;
  subtotal: number;
}

interface CartState {
  id: string;
  items: CartItem[];
  subtotal: number;
}

interface CartContextValue {
  cart: CartState | null;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch {
      setCart({ id: '', items: [], subtotal: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (variantId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/cart/items', { variantId, quantity });
      setCart(data);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
      setCart(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.delete(`/cart/items/${itemId}`);
      setCart(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    await api.delete('/cart');
    setCart({ id: cart?.id || '', items: [], subtotal: 0 });
  }, [cart]);

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateItem,
        updateQuantity: updateItem,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
