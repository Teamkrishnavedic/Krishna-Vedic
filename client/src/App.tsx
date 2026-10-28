import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Layouts
import StorefrontLayout from '@/layouts/StorefrontLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Storefront pages
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import CategoryPage from '@/pages/CategoryPage';
import CategoriesPage from '@/pages/CategoriesPage';
import ProductPage from '@/pages/ProductPage';
import SearchPage from '@/pages/SearchPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AccountPage from '@/pages/AccountPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import AddressesPage from '@/pages/AddressesPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ShippingPage from '@/pages/ShippingPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import ReturnsPage from '@/pages/ReturnsPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Admin pages (lazy loaded)
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminProductEdit = lazy(() => import('@/pages/admin/AdminProductEdit'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminOrderDetail = lazy(() => import('@/pages/admin/AdminOrderDetail'));
const AdminCustomers = lazy(() => import('@/pages/admin/AdminCustomers'));
const AdminCoupons = lazy(() => import('@/pages/admin/AdminCoupons'));
const AdminInventory = lazy(() => import('@/pages/admin/AdminInventory'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'));
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));
const AdminPriceHistory = lazy(() => import('@/pages/admin/AdminPriceHistory'));
const AdminShipping = lazy(() => import('@/pages/admin/AdminShipping'));
const AdminStaff = lazy(() => import('@/pages/admin/AdminStaff'));
const AdminAuditLog = lazy(() => import('@/pages/admin/AdminAuditLog'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><span className="spinner" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin, isStaff, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><span className="spinner" /></div>;
  if (!isStaff) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const tree = (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span className="spinner" /></div>}>
              <Routes>
                {/* ── Storefront ─────────────────────────────────────── */}
                <Route element={<StorefrontLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="shop/:category" element={<CategoryPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="products" element={<CategoriesPage />} />
                  <Route path="products/:slug" element={<ProductPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="shipping" element={<ShippingPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="returns" element={<ReturnsPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />

                  {/* Protected customer routes */}
                  <Route path="checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
                  <Route path="order-confirmation/:orderNumber" element={<RequireAuth><OrderConfirmationPage /></RequireAuth>} />
                  <Route path="account" element={<RequireAuth><AccountPage /></RequireAuth>} />
                  <Route path="account/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
                  <Route path="account/orders/:orderNumber" element={<RequireAuth><OrderDetailPage /></RequireAuth>} />
                  <Route path="account/addresses" element={<RequireAuth><AddressesPage /></RequireAuth>} />
                </Route>

                {/* ── Admin ─────────────────────────────────────────── */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductEdit />} />
                  <Route path="products/:id/edit" element={<AdminProductEdit />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="price-history" element={<AdminPriceHistory />} />
                  <Route path="shipping" element={<AdminShipping />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="staff" element={<AdminStaff />} />
                  <Route path="audit-log" element={<AdminAuditLog />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  if (GOOGLE_CLIENT_ID) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {tree}
      </GoogleOAuthProvider>
    );
  }

  return tree;
}
