import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { SearchPage } from '../pages/SearchPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { WishlistPage } from '../pages/WishlistPage';
import { ProfilePage } from '../pages/ProfilePage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { AddressesPage } from '../pages/AddressesPage';
import { SalesmanApplyPage } from '../pages/SalesmanApplyPage';
import { SellerRoute } from './SellerRoute';
import { SellerLayout } from '../layouts/SellerLayout';
import { SellerDashboardPage } from '../pages/seller/DashboardPage';
import { SellerProductsPage } from '../pages/seller/ProductsPage';
import { SellerOrdersPage } from '../pages/seller/OrdersPage';
import { SellerAnalyticsPage } from '../pages/seller/AnalyticsPage';
import { SellerStorePage } from '../pages/seller/StorePage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { AdminLayout } from '../layouts/AdminLayout';
import { DashboardPage as AdminDashboard } from '../pages/admin/DashboardPage';
import { ProductsPage as AdminProducts } from '../pages/admin/ProductsPage';
import { ProductFormPage as AdminProductForm } from '../pages/admin/ProductFormPage';
import { OrdersPage as AdminOrders } from '../pages/admin/OrdersPage';
import { CustomersPage as AdminCustomers } from '../pages/admin/CustomersPage';
import { CouponsPage as AdminCoupons } from '../pages/admin/CouponsPage';
import { AdminSalesmanPage } from '../pages/admin/SalesmanPage';
import { SettingsPage as AdminSettings } from '../pages/admin/SettingsPage';

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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/addresses" element={<AddressesPage />} />
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/account/orders/:id" element={<OrdersPage />} />
          <Route path="/account/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/apply-salesman" element={<SalesmanApplyPage />} />
        </Route>

        {/* Seller Routes */}
        <Route element={<SellerRoute />}>
          <Route element={<SellerLayout />}>
            <Route path="/seller" element={<SellerDashboardPage />} />
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/analytics" element={<SellerAnalyticsPage />} />
            <Route path="/seller/store" element={<SellerStorePage />} />
          </Route>
        </Route>
      </Route>

      {/* Admin Layout */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/salesman-applications" element={<AdminSalesmanPage />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
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
