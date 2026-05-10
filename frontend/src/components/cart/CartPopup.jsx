import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function CartPopup() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    selectedItemIds,
    setSelectedItemIds,
    setIsManualSelection,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const selectedItems = cartItems.filter((item) =>
    selectedItemIds.includes(item.id)
  );

  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.newPrice * item.quantity,
    0
  );

  const allSelected =
    cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  const handleToggleSelectAll = () => {
    setIsManualSelection(true);
    if (allSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map((item) => item.id));
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-40"
      onClick={() => setIsCartOpen(false)}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-semibold">Giỏ hàng của bạn</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setIsCartOpen(false); navigate("/cart"); }}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
            >
              Xem giỏ hàng
            </button>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBag size={64} className="mb-4 opacity-30" />
              <p className="text-lg">Giỏ hàng của bạn đang trống</p>
              <p className="text-sm mt-2">Hãy thêm sản phẩm vào giỏ hàng!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2 px-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleSelectAll}
                  />
                  <span>Chọn tất cả sản phẩm</span>
                </label>
                <span className="text-xs text-gray-500">
                  Đã chọn {selectedItems.length}/{cartItems.length}
                </span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-3 flex gap-3 relative hover:shadow-md transition"
                >
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.includes(item.id)}
                      onChange={() => {
                        if (selectedItemIds.includes(item.id)) {
                          setSelectedItemIds(
                            selectedItemIds.filter((id) => id !== item.id)
                          );
                        } else {
                          setSelectedItemIds([...selectedItemIds, item.id]);
                        }
                      }}
                    />
                  </div>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-contain rounded border"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2 mb-1">
                    {item.name}
                  </p>
                  {item.variant && (
                    <p className="text-xs text-gray-500 mb-1">
                      Phiên bản: {item.variant}
                    </p>
                  )}
                  <p className="text-base font-bold text-red-600 mb-2">
                    {formatPrice(item.newPrice)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-7 h-7 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-red-100 text-red-600 rounded transition"
                  title="Xóa sản phẩm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              ))}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t bg-white space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-red-600">{formatPrice(subtotal)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-lg"
            >
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
