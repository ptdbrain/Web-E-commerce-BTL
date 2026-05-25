import React from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/DashBoard.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx';
import AdminChatPage from './pages/admin/AdminChatPage.jsx';
import AdminVouchersPage from './pages/admin/AdminVouchersPage.jsx';

export default function AdminPortal() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      window.dispatchEvent(new Event('authChanged'));
    } catch {
      window.dispatchEvent(new Event('authChanged'));
    }
    navigate('/login', { replace: true });
  };

  // Nested routes dưới /admin/*, dùng AdminLayout làm layout cha
  return (
    <Routes>
      <Route element={<AdminLayout onLogout={handleLogout} />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="vouchers" element={<AdminVouchersPage />} />
        <Route path="chat" element={<AdminChatPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
