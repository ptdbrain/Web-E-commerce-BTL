import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Users, Package } from 'lucide-react';
import { formatPriceAdmin } from './utils';

export const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold">Đơn hàng #{order.id}</h3>
          <button onClick={onClose}><LogOut className="rotate-180" size={20} /></button>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold flex items-center gap-2 mb-3"><Users size={18}/> Khách hàng</h4>
            <div className="text-sm space-y-1 text-gray-600">
              <p>{order.customer}</p>
              <p>{order.phone}</p>
              <p>{order.address}</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold flex items-center gap-2 mb-3"><Package size={18}/> Sản phẩm</h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-2">
                  <span>{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                  <span className="font-medium">{formatPriceAdmin(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-red-600 pt-2 text-lg">
                <span>Tổng:</span>
                <span>{formatPriceAdmin(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailModal;
