import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Trạng thái chờ xác nhận ZaloPay (xử lý ở background) - load từ localStorage
  const [pendingZaloPayOrder, setPendingZaloPayOrder] = useState(() => {
    try {
      const saved = localStorage.getItem("pendingZaloPayOrder");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Kiểm tra xem đã quá 60 giây chưa (cho phép buffer)
        if (parsed.createdAt && Date.now() - parsed.createdAt < 60000) {
          return parsed;
        } else {
          localStorage.removeItem("pendingZaloPayOrder");
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Danh sách id sản phẩm được chọn để thanh toán
  const [selectedItemIds, setSelectedItemIds] = useState(() =>
    cartItems.map((item) => item.id)
  );
  // Khi true, giữ nguyên lựa chọn hiện tại, không tự động thêm sản phẩm mới
  const [isManualSelection, setIsManualSelection] = useState(false);

  // Danh sách sản phẩm thanh toán trực tiếp (Mua ngay), tách biệt với giỏ hàng
  const [directCheckoutItems, setDirectCheckoutItems] = useState([]);

  // Voucher đang áp dụng ở checkout
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherResult, setVoucherResult] = useState(null);

  // state mở/đóng popup giỏ hàng
  const [isCartOpen, setIsCartOpen] = useState(false);

  // state mở/đóng form thanh toán
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // danh sách đơn hàng đã đặt (lấy từ backend)
  const [orders, setOrders] = useState([]);

  // Tự động xác nhận ZaloPay order sau 30 giây (chạy ở background)
  useEffect(() => {
    if (!pendingZaloPayOrder) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setPendingZaloPayOrder(null);
      localStorage.removeItem("pendingZaloPayOrder");
      return;
    }

    // Tính thời gian còn lại (nếu order được tạo trước đó)
    const elapsed = Date.now() - (pendingZaloPayOrder.createdAt || Date.now());
    const remainingTime = Math.max(30000 - elapsed, 1000); // Tối thiểu 1 giây

    console.log(`[ZaloPay] Will auto confirm in ${remainingTime}ms`);

    // Sau thời gian còn lại, tự động confirm order
    const timeoutId = setTimeout(async () => {
      console.log(
        `[ZaloPay] Starting auto confirm for order: ${pendingZaloPayOrder.id}`
      );
      try {
        const res = await axios.post(
          `https://it4409-deploy-backend.onrender.com/api/payment/zalopay/confirm/${pendingZaloPayOrder.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("[ZaloPay] Confirm response:", res.data);

        if (res.data?.orderStatus === "confirmed") {
          console.log("[ZaloPay] Order auto confirmed");

          // Refresh orders list
          const ordersRes = await axios.get(
            "https://it4409-deploy-backend.onrender.com/api/orders/my",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const serverOrders = Array.isArray(ordersRes?.data?.orders)
            ? ordersRes.data.orders
            : [];
          const mappedOrders = serverOrders.map((o) => ({
            id: o._id,
            customer: o.customerName,
            phone: o.customerPhone,
            address: o.shippingAddress,
            total: o.totalPrice,
            items: Array.isArray(o.items)
              ? o.items.map((it, idx) => ({
                  id: it.productId || idx,
                  name: it.productName,
                  quantity: it.quantity,
                  newPrice: it.price,
                }))
              : [],
          }));
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error("[ZaloPay] Auto confirm error:", err);
      } finally {
        setPendingZaloPayOrder(null);
        localStorage.removeItem("pendingZaloPayOrder");
      }
    }, remainingTime);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pendingZaloPayOrder]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // Đồng bộ selectedItemIds với cartItems
  // - Luôn loại bỏ các id không còn trong giỏ
  // - Nếu không ở chế độ chọn thủ công, tự động chọn sản phẩm mới thêm
  useEffect(() => {
    setSelectedItemIds((prev) => {
      const currentIds = cartItems.map((item) => item.id);

      // Giữ lại những id còn tồn tại trong giỏ
      let next = prev.filter((id) => currentIds.includes(id));

      // Nếu không ở chế độ chọn thủ công thì tự động thêm sản phẩm mới
      if (!isManualSelection) {
        const newlyAddedIds = currentIds.filter((id) => !next.includes(id));
        next = [...next, ...newlyAddedIds];
      }

      return next;
    });
  }, [cartItems, isManualSelection]);

  // load orders từ backend khi đã đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://it4409-deploy-backend.onrender.com/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const serverOrders = Array.isArray(res?.data?.orders)
          ? res.data.orders
          : [];

        const mappedOrders = serverOrders.map((o) => ({
          id: o._id,
          customer: o.customerName,
          phone: o.customerPhone,
          address: o.shippingAddress,
          total: o.totalPrice,
          items: Array.isArray(o.items)
            ? o.items.map((it, idx) => ({
                id: it.productId || idx,
                name: it.productName,
                quantity: it.quantity,
                newPrice: it.price,
              }))
            : [],
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching orders from backend:", error);
      }
    };

    fetchOrders();
  }, []);

  // thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // tăng số lượng nếu đã có
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // giảm số lượng hoặc xóa nếu quantity = 1
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // xóa sản phẩm khỏi giỏ
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // xử lý đặt hàng
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Nếu có danh sách Mua ngay thì ưu tiên dùng, ngược lại dùng sản phẩm đã chọn trong giỏ
    const selectedItems =
      directCheckoutItems && directCheckoutItems.length > 0
        ? directCheckoutItems
        : cartItems.filter((item) => selectedItemIds.includes(item.id));

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      selectedItems.length === 0
    ) {
      alert(
        "Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 sản phẩm để thanh toán."
      );
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt hàng.");
      return;
    }

    try {
      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        paymentMethod,
        voucherCode: voucherCode || undefined,
        items: selectedItems.map((item) => ({
          productId: item.id,
          productName: item.name,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          newPrice: item.newPrice,
        })),
      };

      const res = await axios.post(
        "https://it4409-deploy-backend.onrender.com/api/orders",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdOrder = res?.data?.order;
      const paymentData = res?.data?.paymentData;

      // Nếu chọn ZaloPay: lưu pending order và mở trang thanh toán trong tab mới
      if (paymentMethod === "zalopay") {
        const redirectUrl =
          paymentData?.order_url ||
          paymentData?.orderurl ||
          paymentData?.orderUrl;

        if (redirectUrl && createdOrder) {
          // Lưu pending order để tự động confirm sau 30 giây (lưu cả vào localStorage)
          const pendingOrder = {
            id: createdOrder._id,
            createdAt: Date.now(),
          };
          setPendingZaloPayOrder(pendingOrder);
          localStorage.setItem(
            "pendingZaloPayOrder",
            JSON.stringify(pendingOrder)
          );

          // Xóa sản phẩm khỏi giỏ ngay khi đặt hàng
          if (!directCheckoutItems || directCheckoutItems.length === 0) {
            setCartItems((prev) =>
              prev.filter((item) => !selectedItemIds.includes(item.id))
            );
            setSelectedItemIds([]);
            setIsManualSelection(false);
          }
          setDirectCheckoutItems([]);
          setVoucherCode("");
          setVoucherResult(null);

          // Mở trang thanh toán ZaloPay trong tab mới và chuyển về trang chủ
          window.open(redirectUrl, "_blank");
          window.location.href = "/";
          return;
        }

        alert("Không tìm thấy link thanh toán ZaloPay.");
        return;
      }
      const newOrder = createdOrder
        ? {
            id: createdOrder._id,
            customer: createdOrder.customerName,
            phone: createdOrder.customerPhone,
            address: createdOrder.shippingAddress,
            items: Array.isArray(createdOrder.items)
              ? createdOrder.items.map((it, idx) => ({
                  id: it.productId || idx,
                  name: it.productName,
                  quantity: it.quantity,
                  newPrice: it.price,
                }))
              : selectedItems,
            total: createdOrder.totalPrice,
          }
        : {
            id: Date.now(),
            customer: formData.name,
            phone: formData.phone,
            address: formData.address,
            items: selectedItems,
            total: selectedItems.reduce(
              (acc, item) => acc + item.newPrice * item.quantity,
              0
            ),
          };

      setOrderSuccess(true);
      // Nếu đặt từ giỏ hàng: xóa các sản phẩm đã chọn khỏi giỏ
      if (!directCheckoutItems || directCheckoutItems.length === 0) {
        setCartItems((prev) =>
          prev.filter((item) => !selectedItemIds.includes(item.id))
        );
        setSelectedItemIds([]);
        setIsManualSelection(false);
      }

      // Luôn reset chế độ Mua ngay sau khi đặt
      setDirectCheckoutItems([]);
      setVoucherCode("");
      setVoucherResult(null);
      setOrders((prevOrders) => [newOrder, ...prevOrders]);

      // đóng form sau 5s
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setOrderSuccess(false);
      }, 5000);
    } catch (err) {
      alert(err?.response?.data?.message || "Đặt hàng thất bại");
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
