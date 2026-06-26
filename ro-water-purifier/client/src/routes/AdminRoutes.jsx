import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import AdminLogin from '../components/admin/AdminLogin.jsx';
import Dashboard from '../components/admin/Dashboard.jsx';
import Products from '../components/admin/Products.jsx';
import GenericResourcePage from '../components/admin/GenericResourcePage.jsx';
import ProductForm from '../components/admin/ProductForm.jsx';
import Reports from '../components/admin/Reports.jsx';
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute.jsx';

const resourcePages = [
  'categories', 'brands', 'orders', 'customers', 
  'inventory', 'coupons', 'reviews', 'banners',
  'cms-pages', 'notifications', 'users', 'roles',
  'permissions', 'settings', 'activity-logs'
];

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="reports" element={<Reports />} />
          
          {resourcePages.map((resource) => (
            <Route 
              key={resource}
              path={resource} 
              element={<GenericResourcePage resource={resource} />} 
            />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}

export default AdminRoutes;