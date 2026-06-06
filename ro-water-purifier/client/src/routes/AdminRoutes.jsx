import { Navigate, Route, Routes } from 'react-router-dom';
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminLogin from '../pages/admin/auth/AdminLogin.jsx';
import ForgotPassword from '../pages/admin/auth/ForgotPassword.jsx';
import ResetPassword from '../pages/admin/auth/ResetPassword.jsx';
import ChangePassword from '../pages/admin/auth/ChangePassword.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import Reports from '../pages/admin/Reports.jsx';
import Products from '../pages/admin/resources/Products.jsx';
import ProductForm from '../pages/admin/resources/ProductForm.jsx';
import GenericResourcePage from '../pages/admin/resources/GenericResourcePage.jsx';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="categories" element={<GenericResourcePage resource="categories" />} />
          <Route path="brands" element={<GenericResourcePage resource="brands" />} />
          <Route path="orders" element={<GenericResourcePage resource="orders" />} />
          <Route path="customers" element={<GenericResourcePage resource="customers" />} />
          <Route path="inventory" element={<GenericResourcePage resource="inventory" />} />
          <Route path="coupons" element={<GenericResourcePage resource="coupons" />} />
          <Route path="reviews" element={<GenericResourcePage resource="reviews" />} />
          <Route path="banners" element={<GenericResourcePage resource="banners" />} />
          <Route path="cms-pages" element={<GenericResourcePage resource="cms-pages" />} />
          <Route path="notifications" element={<GenericResourcePage resource="notifications" />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<GenericResourcePage resource="settings" />} />
          <Route path="users" element={<GenericResourcePage resource="users" />} />
          <Route path="roles" element={<GenericResourcePage resource="roles" />} />
          <Route path="permissions" element={<GenericResourcePage resource="permissions" />} />
          <Route path="activity-logs" element={<GenericResourcePage resource="activity-logs" />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
