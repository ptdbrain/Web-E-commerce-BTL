import React from 'react';
import { ShieldCheck, BarChart3, ShoppingBag, Package, MessagesSquare, TicketPercent } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export const AdminLayout = ({ onLogout }) => {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col">
      {/* Thanh header admin giống header chính nhưng chỉ có logo + menu admin */}
      <header className="bg-sky-100 px-8 py-4 flex justify-between items-center border-b border-sky-200 z-10 relative">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer text-3xl font-bold text-blue-500 relative pr-2.5"
        >
          Tech-Geeks
          <span className="w-1 h-6 bg-orange-500 rounded absolute right-0 top-1/2 -translate-y-1/2"></span>
        </div>

        {/* Menu chức năng admin */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-500 ${
                isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-800'
              }`
            }
          >
            <BarChart3 size={18} />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-500 ${
                isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-800'
              }`
            }
          >
            <ShoppingBag size={18} />
            <span>Đơn hàng</span>
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-500 ${
                isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-800'
              }`
            }
          >
            <Package size={18} />
            <span>Sản phẩm</span>
          </NavLink>
          <NavLink
            to="/admin/vouchers"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-500 ${
                isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-800'
              }`
            }
          >
            <TicketPercent size={18} />
            <span>Voucher</span>
          </NavLink>
          <NavLink
            to="/admin/chat"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white hover:text-blue-500 ${
                isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-800'
              }`
            }
          >
            <MessagesSquare size={18} />
            <span>Chat khách hàng</span>
          </NavLink>
        </nav>

        {/* Nút về trang chủ */}
        <button
          onClick={handleLogoutClick}
          className="text-sm font-medium text-gray-700 hover:text-red-500"
        >
          Về trang chủ
        </button>
      </header>

      {/* Nội dung admin */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
