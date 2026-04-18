import { useState, useEffect } from 'react';
import mockOrders from '../api/mockOrders';

export function useOrders() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : mockOrders;
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  return { orders, setOrders };
}