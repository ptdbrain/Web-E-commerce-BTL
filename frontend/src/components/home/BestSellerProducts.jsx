import { useEffect, useState, memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

// Memoized Product Card component
const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
}) {
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              HOT
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Product name */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors min-h-[40px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-red-600 font-bold text-base">
              {(product.discountPrice || product.price).toLocaleString("vi-VN")}
              ₫
            </span>
            {hasDiscount && (
              <span className="text-gray-400 text-xs line-through">
                {product.price.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex text-yellow-400 text-xs">{"★".repeat(5)}</div>
            <span className="text-gray-400 text-xs">
              ({product.reviewCount || 0})
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => onAddToCart(e, product)}
            className="flex-1 bg-blue-50 text-blue-600 text-xs font-medium py-2 px-2 rounded hover:bg-blue-100 transition-colors"
          >
            🛒 Thêm
          </button>
          <button
            onClick={(e) => onBuyNow(e, product)}
            className="flex-1 bg-red-600 text-white text-xs font-medium py-2 px-2 rounded hover:bg-red-700 transition-colors"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </Link>
  );
});

export default function BestSellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://it4409-deploy-backend.onrender.com/api/products/bestsellers?limit=15", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching best seller products:", err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handleAddToCart = useCallback(
    (e, product) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
        id: product._id,
        name: product.name,
        imageUrl: product.images?.[0] || "",
        newPrice: product.discountPrice || product.price,
        oldPrice: product.discountPrice ? product.price : null,
        quantity: 1,
      });
    },
    [addToCart]
  );

  const handleBuyNow = useCallback(
    (e, product) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
        id: product._id,
        name: product.name,
        imageUrl: product.images?.[0] || "",
        newPrice: product.discountPrice || product.price,
        oldPrice: product.discountPrice ? product.price : null,
        quantity: 1,
      });
      navigate("/checkout");
    },
    [addToCart, navigate]
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Sản phẩm bán chạy
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg h-72"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Sản phẩm bán chạy
        </h2>
        <Link
          to="/products"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          Xem tất cả
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ))}
      </div>
    </section>
  );
}
