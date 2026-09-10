import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// ── Critical path: eagerly loaded (always needed on first visit) ──────────────
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { SearchPage } from '../pages/SearchPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { WishlistPage } from '../pages/WishlistPage';

// ── Route guards (tiny, must load synchronously) ──────────────────────────────
import { ProtectedRoute } from './ProtectedRoute';
import { SellerRoute } from './SellerRoute';
import { AdminRoute } from './AdminRoute';

// ── Lazy-loaded: protected user pages ─────────────────────────────────────────
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrdersPage = lazy(() => import('../pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const AddressesPage = lazy(() => import('../pages/AddressesPage').then(m => ({ default: m.AddressesPage })));
const SalesmanApplyPage = lazy(() => import('../pages/SalesmanApplyPage').then(m => ({ default: m.SalesmanApplyPage })));

// ── Lazy-loaded: seller layout + pages ────────────────────────────────────────
const SellerLayout = lazy(() => import('../layouts/SellerLayout').then(m => ({ default: m.SellerLayout })));
const SellerDashboardPage = lazy(() => import('../pages/seller/DashboardPage').then(m => ({ default: m.SellerDashboardPage })));
const SellerProductsPage = lazy(() => import('../pages/seller/ProductsPage').then(m => ({ default: m.SellerProductsPage })));
const SellerOrdersPage = lazy(() => import('../pages/seller/OrdersPage').then(m => ({ default: m.SellerOrdersPage })));
const SellerAnalyticsPage = lazy(() => import('../pages/seller/AnalyticsPage').then(m => ({ default: m.SellerAnalyticsPage })));
const SellerStorePage = lazy(() => import('../pages/seller/StorePage').then(m => ({ default: m.SellerStorePage })));

// ── Lazy-loaded: admin layout + pages ─────────────────────────────────────────
const AdminLayout = lazy(() => import('../layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('../pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AdminProducts = lazy(() => import('../pages/admin/ProductsPage').then(m => ({ default: m.ProductsPage })));
const AdminProductForm = lazy(() => import('../pages/admin/ProductFormPage').then(m => ({ default: m.ProductFormPage })));
const AdminOrders = lazy(() => import('../pages/admin/OrdersPage').then(m => ({ default: m.OrdersPage })));
const AdminCustomers = lazy(() => import('../pages/admin/CustomersPage').then(m => ({ default: m.CustomersPage })));
const AdminCoupons = lazy(() => import('../pages/admin/CouponsPage').then(m => ({ default: m.CouponsPage })));
const AdminSalesmanPage = lazy(() => import('../pages/admin/SalesmanPage').then(m => ({ default: m.AdminSalesmanPage })));
const AdminSettings = lazy(() => import('../pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));

const PageSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main App Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
         <Route path="/products" element={<ProductsPage />} />
         <Route path="/search" element={<SearchPage />} />
         <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Suspense fallback={<PageSpinner />}><ProfilePage /></Suspense>} />
          <Route path="/account" element={<Suspense fallback={<PageSpinner />}><ProfilePage /></Suspense>} />
          <Route path="/account/profile" element={<Suspense fallback={<PageSpinner />}><ProfilePage /></Suspense>} />
          <Route path="/account/addresses" element={<Suspense fallback={<PageSpinner />}><AddressesPage /></Suspense>} />
          <Route path="/account/orders" element={<Suspense fallback={<PageSpinner />}><OrdersPage /></Suspense>} />
          <Route path="/account/orders/:id" element={<Suspense fallback={<PageSpinner />}><OrdersPage /></Suspense>} />
          <Route path="/account/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<Suspense fallback={<PageSpinner />}><CheckoutPage /></Suspense>} />
          <Route path="/orders" element={<Suspense fallback={<PageSpinner />}><OrdersPage /></Suspense>} />
          <Route path="/addresses" element={<Suspense fallback={<PageSpinner />}><AddressesPage /></Suspense>} />
          <Route path="/apply-salesman" element={<Suspense fallback={<PageSpinner />}><SalesmanApplyPage /></Suspense>} />
        </Route>

        {/* Seller Routes */}
        <Route element={<SellerRoute />}>
          <Route element={<Suspense fallback={<PageSpinner />}><SellerLayout /></Suspense>}>
            <Route path="/seller" element={<Suspense fallback={<PageSpinner />}><SellerDashboardPage /></Suspense>} />
            <Route path="/seller/products" element={<Suspense fallback={<PageSpinner />}><SellerProductsPage /></Suspense>} />
            <Route path="/seller/orders" element={<Suspense fallback={<PageSpinner />}><SellerOrdersPage /></Suspense>} />
            <Route path="/seller/analytics" element={<Suspense fallback={<PageSpinner />}><SellerAnalyticsPage /></Suspense>} />
            <Route path="/seller/store" element={<Suspense fallback={<PageSpinner />}><SellerStorePage /></Suspense>} />
          </Route>
        </Route>
      </Route>

      {/* Admin Layout */}
      <Route element={<AdminRoute />}>
        <Route element={<Suspense fallback={<PageSpinner />}><AdminLayout /></Suspense>}>
          <Route path="/admin" element={<Suspense fallback={<PageSpinner />}><AdminDashboard /></Suspense>} />
          <Route path="/admin/products" element={<Suspense fallback={<PageSpinner />}><AdminProducts /></Suspense>} />
          <Route path="/admin/products/new" element={<Suspense fallback={<PageSpinner />}><AdminProductForm /></Suspense>} />
          <Route path="/admin/products/:id/edit" element={<Suspense fallback={<PageSpinner />}><AdminProductForm /></Suspense>} />
          <Route path="/admin/orders" element={<Suspense fallback={<PageSpinner />}><AdminOrders /></Suspense>} />
          <Route path="/admin/customers" element={<Suspense fallback={<PageSpinner />}><AdminCustomers /></Suspense>} />
          <Route path="/admin/coupons" element={<Suspense fallback={<PageSpinner />}><AdminCoupons /></Suspense>} />
          <Route path="/admin/salesman-applications" element={<Suspense fallback={<PageSpinner />}><AdminSalesmanPage /></Suspense>} />
          <Route path="/admin/settings" element={<Suspense fallback={<PageSpinner />}><AdminSettings /></Suspense>} />
        </Route>
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
