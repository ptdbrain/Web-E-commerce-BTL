import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";

import {
  addCartItem as addCartItemRequest,
  fetchCart,
  removeCartItem as removeCartItemRequest,
  updateCartItemQuantity as updateCartItemQuantityRequest,
} from "../api/cartApi.js";
import { buildApiUrl } from "../config/api.js";
import { calculateCheckoutTotals } from "../utils/checkoutPricing.js";
import { buildCartItemKey, calculateConfiguredUnitPrice } from "../utils/cartItem.js";
import {
  buildCartApiItemPayload,
  buildOrderItemPayload,
  getItemBasePrice,
  mapServerCartItem,
} from "../utils/cartPayload.js";

export const CartContext = createContext();

const getStoredToken = () => localStorage.getItem("token") || "";

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

const readStoredCartItems = () => {
  try {
    const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
};

const normalizeCartItem = (item = {}) => {
  if (item.productId || item.productName) {
    return mapServerCartItem(item);
  }

  const id = String(item.id || item.productId || item._id || "");
  const basePrice = getItemBasePrice(item);
  const selectedAddons = Array.isArray(item.selectedAddons)
    ? item.selectedAddons
    : [];
  const selectedSize = item.selectedSize || null;
  const configuredUnitPrice =
    item.configuredUnitPrice ??
    item.unitPrice ??
    calculateConfiguredUnitPrice({
      ...item,
      newPrice: basePrice,
      selectedAddons,
      selectedSize,
    });

  return {
    ...item,
    id,
    _id: id,
    quantity: Math.max(1, Number(item.quantity || 1)),
    imageUrl: item.imageUrl || item.image || item.thumbnail || "",
    image: item.image || item.imageUrl || item.thumbnail || "",
    basePrice,
    newPrice: basePrice,
    configuredUnitPrice,
    selectedSize,
    selectedAddons,
    itemNote: String(item.itemNote || item.note || "").trim(),
    cartKey: item.cartKey || buildCartItemKey({ ...item, id }),
  };
};

const mergeLocalCartItems = (items = [], incomingItem) => {
  const nextItem = normalizeCartItem(incomingItem);
  const existingItem = items.find((item) => item.cartKey === nextItem.cartKey);

  if (!existingItem) {
    return [...items, nextItem];
  }

  const nextQuantity = existingItem.quantity + nextItem.quantity;
  if (nextQuantity <= 0) {
    return items.filter((item) => item.cartKey !== nextItem.cartKey);
  }

  return items.map((item) =>
    item.cartKey === nextItem.cartKey
      ? normalizeCartItem({
          ...existingItem,
          ...nextItem,
          quantity: nextQuantity,
        })
      : item
  );
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
        basePrice: item.basePrice ?? item.price,
        configuredUnitPrice: item.unitPrice || item.price,
        newPrice: item.basePrice ?? item.price,
        selectedSize: item.selectedSize,
        selectedAddons: item.selectedAddons || [],
        itemNote: item.itemNote,
      }))
    : [],
});

export function CartProvider({ children }) {
  const [authToken, setAuthToken] = useState(getStoredToken);
  const [cartItems, setCartItems] = useState(() =>
    readStoredCartItems().map(normalizeCartItem)
  );
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
  const authTokenRef = useRef(authToken);
  const cartItemsRef = useRef(cartItems);
  const guestCartSnapshotRef = useRef([]);

  const applyServerCart = useCallback((cart) => {
    const nextItems = Array.isArray(cart?.items)
      ? cart.items.map(mapServerCartItem)
      : [];
    setCartItems(nextItems);
  }, []);

  const syncCartFromServer = useCallback(
    async (guestItems = []) => {
      if (!authToken) return;

      try {
        let remoteCart = await fetchCart(authToken);

        for (const guestItem of guestItems.map(normalizeCartItem)) {
          remoteCart = await addCartItemRequest(
            authToken,
            buildCartApiItemPayload(guestItem)
          );
        }

        applyServerCart(remoteCart);
      } catch (error) {
        console.error("Error syncing cart from backend:", error);
      }
    },
    [authToken, applyServerCart]
  );

  const removePurchasedCartItems = useCallback(
    async (itemsToRemove = []) => {
      const cartKeys = itemsToRemove
        .map((item) => item.cartKey)
        .filter(Boolean);

      if (cartKeys.length === 0) return;

      if (!authToken) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => !cartKeys.includes(item.cartKey))
        );
        return;
      }

      let latestCart = null;

      for (const cartKey of cartKeys) {
        try {
          latestCart = await removeCartItemRequest(authToken, cartKey);
        } catch (error) {
          console.error("Error removing purchased cart item:", error);
        }
      }

      if (latestCart) {
        applyServerCart(latestCart);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => !cartKeys.includes(item.cartKey))
      );
    },
    [authToken, applyServerCart]
  );

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    authTokenRef.current = authToken;
  }, [authToken]);

  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  useEffect(() => {
    const handleAuthChanged = () => {
      const nextToken = getStoredToken();

      if (!authTokenRef.current && nextToken) {
        guestCartSnapshotRef.current = cartItemsRef.current;
      }

      setAuthToken(nextToken);
    };

    window.addEventListener("authChanged", handleAuthChanged);
    window.addEventListener("storage", handleAuthChanged);

    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
      window.removeEventListener("storage", handleAuthChanged);
    };
  }, []);

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
    if (!authToken) return;

    const guestItems = guestCartSnapshotRef.current;
    guestCartSnapshotRef.current = [];
    syncCartFromServer(guestItems);
  }, [authToken, syncCartFromServer]);

  useEffect(() => {
    if (!authToken) {
      setOrders([]);
      return;
    }

    axios
      .get(buildApiUrl("/orders/my"), {
        headers: { Authorization: `Bearer ${authToken}` },
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
  }, [authToken]);

  useEffect(() => {
    if (!pendingZaloPayOrder) return;

    if (!authToken) {
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
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const ordersResponse = await axios.get(buildApiUrl("/orders/my"), {
          headers: { Authorization: `Bearer ${authToken}` },
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
  }, [authToken, pendingZaloPayOrder]);

  const addToCart = useCallback(
    async (product) => {
      const nextItem = normalizeCartItem(product);

      if (authToken) {
        try {
          const cart = await addCartItemRequest(
            authToken,
            buildCartApiItemPayload(nextItem)
          );
          applyServerCart(cart);
          return;
        } catch (error) {
          console.error("Error adding item to backend cart:", error);
        }
      }

      setCartItems((prevItems) => mergeLocalCartItems(prevItems, nextItem));
    },
    [authToken, applyServerCart]
  );

  const decreaseQuantity = useCallback(
    async (cartKey) => {
      const existingItem = cartItems.find((item) => item.cartKey === cartKey);
      if (!existingItem) return;

      if (authToken) {
        try {
          if (existingItem.quantity <= 1) {
            const cart = await removeCartItemRequest(authToken, cartKey);
            applyServerCart(cart);
            return;
          }

          const cart = await updateCartItemQuantityRequest(
            authToken,
            cartKey,
            existingItem.quantity - 1
          );
          applyServerCart(cart);
          return;
        } catch (error) {
          console.error("Error decreasing backend cart quantity:", error);
        }
      }

      setCartItems((prevItems) =>
        prevItems
          .map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    [authToken, applyServerCart, cartItems]
  );

  const removeFromCart = useCallback(
    async (cartKey) => {
      if (authToken) {
        try {
          const cart = await removeCartItemRequest(authToken, cartKey);
          applyServerCart(cart);
          return;
        } catch (error) {
          console.error("Error removing item from backend cart:", error);
        }
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.cartKey !== cartKey)
      );
    },
    [authToken, applyServerCart]
  );

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

    if (!authToken) {
      alert("Ban can dang nhap de dat mon.");
      return;
    }

    try {
      const pricing = calculateCheckoutTotals({
        items: selectedItems,
        fulfillmentType: formData.fulfillmentType,
        voucherResult,
      });

      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        shippingAddress:
          formData.fulfillmentType === "delivery" ? formData.address : "",
        fulfillmentType: formData.fulfillmentType,
        pickupTime:
          formData.fulfillmentType === "pickup"
            ? formData.pickupTime
            : undefined,
        tableBooking:
          formData.fulfillmentType === "dine_in"
            ? {
                guestCount: Number(formData.guestCount),
                bookingTime: formData.bookingTime,
                contactNote: formData.contactNote,
              }
            : undefined,
        paymentMethod,
        deliveryFee: pricing.deliveryFee,
        voucherCode: voucherCode || undefined,
        items: selectedItems.map(buildOrderItemPayload),
      };

      const response = await axios.post(buildApiUrl("/orders"), payload, {
        headers: { Authorization: `Bearer ${authToken}` },
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
            await removePurchasedCartItems(selectedItems);
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
        await removePurchasedCartItems(selectedItems);
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
