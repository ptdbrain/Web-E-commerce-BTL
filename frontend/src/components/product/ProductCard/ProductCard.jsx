import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
// ...existing code...
import { useCart } from "../../../hooks/useCart";
import { useToast } from "../../../contexts/ToastContext";
import { getProducts } from "../../../api/productsApi";
import OptimizedImage from "../../common/OptimizedImage";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { success } = useToast();
  const queryClient = useQueryClient();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartProduct = {
      id: product.id,
      name: product.name || product.title,
      newPrice: product.price,
      imageUrl: product.thumbnail || product.image,
      oldPrice: product.originalPrice,
      brand: product.brand,
    };
    addToCart(cartProduct);

    // Hiển thị thông báo và mở giỏ hàng
    success(`Đã thêm "${product.name || product.title}" vào giỏ hàng!`);

    // Mở giỏ hàng sau 300ms
    setTimeout(() => {
      setIsCartOpen(true);
    }, 300);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Prefetch product detail khi hover
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ["product", product.id],
      queryFn: async () => {
        const products = await getProducts();
        return products.find((p) => p.id === product.id);
      },
      staleTime: 60000, // Cache 1 phút
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md cursor-pointer overflow-hidden relative"
    >
      {/* Header */}
      <div className="relative">
        {/* Nhãn Giảm giá */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            <span>-{Math.round(product.discount)}%</span>
          </div>
        )}
        {/* Hình ảnh */}
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.thumbnail || product.image ? (
            <img
              src={product.thumbnail || product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center text-gray-300 w-full h-full">
              No image
            </div>
          )}
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4">
        {/* Tên sản phẩm */}
        <h3
          className="text-gray-800 font-semibold mb-3 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "48px",
            maxHeight: "48px",
          }}
        >
          {product.name || product.title}
        </h3>
        {/* Giá */}
        <div className="mb-3">
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-gray-400 text-sm line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )}
          <div className="text-red-600 text-xl font-bold">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>

      {/* Overlay hết hàng */}
      {product.stock === 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="bg-white px-6 py-3 rounded-lg text-red-600 font-bold shadow-xl">
            HẾT HÀNG
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
