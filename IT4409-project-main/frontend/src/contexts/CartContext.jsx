import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../config/api";
import {
  buildCartItemKey,
  calculateConfiguredUnitPrice,
} from "../utils/cartItem";

export const CartContext = createContext();

const createDefaultFormData = () => ({
  name: "",
  phone: "",
  address: "",
  fulfillmentType: "delivery",
  pickupTime: "",
  bookingTime: "",
  guestCount: "2",
  contactNote: "",
});

const normalizeCartItem = (item) => {
  const configuredUnitPrice =
    item.configuredUnitPrice ?? calculateConfiguredUnitPrice(item);

  return {
    ...item,
    quantity: Math.max(1, Number(item.quantity || 1)),
    imageUrl: item.imageUrl || item.image || item.thumbnail || "",
    newPrice: item.newPrice ?? item.price ?? configuredUnitPrice,
    configuredUnitPrice,
    cartKey: item.cartKey || buildCartItemKey(item),
  };
};

const mapOrderForState = (order) => ({
  id: order._id,
  customer: order.customerName,
  phone: order.customerPhone,
  address: order.shippingAddress,
  fulfillmentType: order.fulfillmentType,
  pickupTime: order.pickupTime,
  tableBooking: order.tableBooking,
  total: order.totalPrice,
  status: order.orderStatus,
  items: Array.isArray(order.items)
    ? order.items.map((item, index) => ({
        id: item.productId || index,
        name: item.productName,
        imageUrl: item.productImage,
        quantity: item.quantity,
        configuredUnitPrice: item.unitPrice || item.price,
        newPrice: item.price,
        selectedSize: item.selectedSize,
        selectedAddons: item.selectedAddons || [],
        itemNote: item.itemNote,
      }))
    : [],
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      return Array.isArray(savedCart) ? savedCart.map(normalizeCartItem) : [];
    } catch {
      return [];
    }
  });
  const [formData, setFormData] = useState(createDefaultFormData);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [pendingZaloPayOrder, setPendingZaloPayOrder] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pendingZaloPayOrder") || "null");
    } catch {
      return null;
    }
  });
  const [selectedItemIds, setSelectedItemIds] = useState(() =>
    cartItems.map((item) => item.cartKey)
  );
  const [isManualSelection, setIsManualSelection] = useState(false);
  const [directCheckoutItems, setDirectCheckoutItems] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherResult, setVoucherResult] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    setSelectedItemIds((prev) => {
      const currentKeys = cartItems.map((item) => item.cartKey);
      let next = prev.filter((key) => currentKeys.includes(key));

      if (!isManualSelection) {
        const missing = currentKeys.filter((key) => !next.includes(key));
        next = [...next, ...missing];
      }

      return next;
    });
  }, [cartItems, isManualSelection]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(buildApiUrl("/orders/my"), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const serverOrders = Array.isArray(response?.data?.orders)
          ? response.data.orders
          : [];
        setOrders(serverOrders.map(mapOrderForState));
      })
      .catch((error) => {
        console.error("Error fetching orders from backend:", error);
      });
  }, []);

  useEffect(() => {
    if (!pendingZaloPayOrder) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setPendingZaloPayOrder(null);
      localStorage.removeItem("pendingZaloPayOrder");
      return;
    }

    const elapsed = Date.now() - (pendingZaloPayOrder.createdAt || Date.now());
    const remainingTime = Math.max(30000 - elapsed, 1000);

    const timeoutId = setTimeout(async () => {
      try {
        await axios.post(
          buildApiUrl(`/payment/zalopay/confirm/${pendingZaloPayOrder.id}`),
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const ordersResponse = await axios.get(buildApiUrl("/orders/my"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const serverOrders = Array.isArray(ordersResponse?.data?.orders)
          ? ordersResponse.data.orders
          : [];
        setOrders(serverOrders.map(mapOrderForState));
      } catch (error) {
        console.error("[ZaloPay] Auto confirm error:", error);
      } finally {
        setPendingZaloPayOrder(null);
        localStorage.removeItem("pendingZaloPayOrder");
      }
    }, remainingTime);

    return () => clearTimeout(timeoutId);
  }, [pendingZaloPayOrder]);

  const addToCart = (product) => {
    const nextItem = normalizeCartItem(product);

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.cartKey === nextItem.cartKey
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.cartKey === nextItem.cartKey
            ? { ...item, quantity: item.quantity + nextItem.quantity }
            : item
        );
      }

      return [...prevItems, nextItem];
    });
  };

  const decreaseQuantity = (cartKey) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartKey !== cartKey)
    );
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    const selectedItems =
      directCheckoutItems.length > 0
        ? directCheckoutItems.map(normalizeCartItem)
        : cartItems.filter((item) => selectedItemIds.includes(item.cartKey));

    if (!formData.name || !formData.phone || selectedItems.length === 0) {
      alert("Vui long dien thong tin va chon it nhat mot mon.");
      return;
    }

    if (formData.fulfillmentType === "delivery" && !formData.address) {
      alert("Vui long nhap dia chi giao hang.");
      return;
    }

    if (formData.fulfillmentType === "pickup" && !formData.pickupTime) {
      alert("Vui long chon gio den lay mon.");
      return;
    }

    if (
      formData.fulfillmentType === "dine_in" &&
      (!formData.bookingTime || !formData.guestCount)
    ) {
      alert("Vui long nhap gio dat ban va so khach.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Ban can dang nhap de dat mon.");
      return;
    }

    try {
      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        shippingAddress:
          formData.fulfillmentType === "delivery" ? formData.address : "",
        fulfillmentType: formData.fulfillmentType,
        pickupTime:
          formData.fulfillmentType === "pickup" ? formData.pickupTime : undefined,
        tableBooking:
          formData.fulfillmentType === "dine_in"
            ? {
                guestCount: Number(formData.guestCount),
                bookingTime: formData.bookingTime,
                contactNote: formData.contactNote,
              }
            : undefined,
        paymentMethod,
        voucherCode: voucherCode || undefined,
        items: selectedItems.map((item) => ({
          productId: item.id,
          productName: item.name,
          productImage: item.imageUrl,
          quantity: item.quantity,
          price: item.newPrice,
          selectedSize: item.selectedSize,
          selectedAddons: item.selectedAddons || [],
          itemNote: item.itemNote || "",
        })),
      };

      const response = await axios.post(buildApiUrl("/orders"), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdOrder = response?.data?.order;
      const paymentData = response?.data?.paymentData;

      if (paymentMethod === "zalopay") {
        const redirectUrl =
          paymentData?.order_url ||
          paymentData?.orderurl ||
          paymentData?.orderUrl;

        if (redirectUrl && createdOrder) {
          const pendingOrder = {
            id: createdOrder._id,
            createdAt: Date.now(),
          };
          setPendingZaloPayOrder(pendingOrder);
          localStorage.setItem(
            "pendingZaloPayOrder",
            JSON.stringify(pendingOrder)
          );

          if (directCheckoutItems.length === 0) {
            setCartItems((prev) =>
              prev.filter((item) => !selectedItemIds.includes(item.cartKey))
            );
          }

          setSelectedItemIds([]);
          setDirectCheckoutItems([]);
          setVoucherCode("");
          setVoucherResult(null);
          window.open(redirectUrl, "_blank");
          window.location.href = "/";
          return;
        }

        alert("Khong tim thay link thanh toan ZaloPay.");
        return;
      }

      if (createdOrder) {
        setOrders((prevOrders) => [mapOrderForState(createdOrder), ...prevOrders]);
      }

      setOrderSuccess(true);

      if (directCheckoutItems.length === 0) {
        setCartItems((prev) =>
          prev.filter((item) => !selectedItemIds.includes(item.cartKey))
        );
      }

      setSelectedItemIds([]);
      setIsManualSelection(false);
      setDirectCheckoutItems([]);
      setVoucherCode("");
      setVoucherResult(null);
      setFormData(createDefaultFormData());

      setTimeout(() => {
        setIsCheckoutOpen(false);
        setOrderSuccess(false);
      }, 4000);
    } catch (error) {
      alert(error?.response?.data?.message || "Dat mon that bai");
    }
  };

  const value = {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    selectedItemIds,
    setSelectedItemIds,
    isManualSelection,
    setIsManualSelection,
    directCheckoutItems,
    setDirectCheckoutItems,
    formData,
    setFormData,
    orderSuccess,
    handlePlaceOrder,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    paymentMethod,
    setPaymentMethod,
    voucherCode,
    setVoucherCode,
    voucherResult,
    setVoucherResult,
    orders,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
