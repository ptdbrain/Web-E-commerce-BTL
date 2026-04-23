import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiX } from "react-icons/fi";
import { useCart } from "../../hooks/useCart";

export function CartPopup() {
  const navigate = useNavigate();
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
    setDirectCheckoutItems,
  } = useCart();

  if (!isCartOpen) return null;

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + (item.configuredUnitPrice || item.newPrice) * item.quantity,
    0
  );

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsManualSelection(false);
    setSelectedItemIds([]);
    setDirectCheckoutItems([]);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white">
                  <FiShoppingBag size={16} />
                </div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Giỏ hàng
                </h2>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                  {cartItems.length}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="font-display text-lg font-bold text-slate-700">
                    Giỏ hàng trống
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Hãy thêm món ngon vào giỏ nhé!
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/products");
                    }}
                    className="mt-5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:shadow-lg transition-shadow"
                  >
                    Khám phá menu
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartKey || item.id}
                      className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-white hover:shadow-sm"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-800 truncate">
                          {item.name}
                        </h4>
                        {item.selectedSize?.label && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Size: {item.selectedSize.label}
                          </p>
                        )}
                        {item.selectedAddons?.length > 0 && (
                          <p className="text-[11px] text-slate-400">
                            +{item.selectedAddons.map((a) => a.label).join(", ")}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-orange-600">
                            {(
                              (item.configuredUnitPrice || item.newPrice) *
                              item.quantity
                            ).toLocaleString("vi-VN")}
                            đ
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                item.quantity <= 1
                                  ? removeFromCart(item.cartKey || item.id)
                                  : decreaseQuantity(item.cartKey || item.id)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                              {item.quantity <= 1 ? (
                                <FiTrash2 size={12} />
                              ) : (
                                <FiMinus size={12} />
                              )}
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-slate-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addToCart({ ...item, quantity: 1 })}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-100 px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Tạm tính</span>
                  <span className="text-xl font-extrabold text-gradient font-display">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                >
                  Tiến hành thanh toán →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartPopup;
