import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { getBestSellerProducts } from "../../api/productsApi";
import { useCart } from "../../hooks/useCart";
import { calculateConfiguredUnitPrice } from "../../utils/cartItem";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function BestSellerProducts() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getBestSellerProducts(10).then(setProducts).catch(console.error);
  }, []);

  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            🔥 Bán chạy trong ngày
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
            Món đang được order nhiều
          </h2>
        </div>
        <Link
          to="/products"
          className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors whitespace-nowrap"
        >
          Xem toàn bộ →
        </Link>
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {products.map((product) => (
          <motion.article
            key={product.id}
            variants={cardVariants}
            className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1"
          >
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="block w-full text-left img-zoom"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
                {/* Discount badge */}
                {product.originalPrice > product.newPrice && (
                  <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                    -{Math.round(
                      ((product.originalPrice - product.newPrice) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </div>
                )}
              </div>
            </button>

            <div className="p-4">
              {/* Badges */}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {(product.badges || []).slice(0, 2).map((badge) => (
                  <span
                    key={badge}
                    className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600"
                  >
                    {badge.replaceAll("_", " ")}
                  </span>
                ))}
              </div>

              {/* Name */}
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="text-left text-sm font-bold text-slate-800 transition-colors hover:text-orange-600 line-clamp-2"
              >
                {product.name}
              </button>

              {/* Meta */}
              <div className="mt-1.5 text-xs text-slate-400">
                {product.preparationTime} phút • {product.category?.name}
              </div>

              {/* Price + Add button */}
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-lg font-extrabold text-gradient">
                    {product.newPrice.toLocaleString("vi-VN")}đ
                  </div>
                  {product.originalPrice > product.newPrice && (
                    <div className="text-xs text-slate-400 line-through">
                      {product.originalPrice.toLocaleString("vi-VN")}đ
                    </div>
                  )}
                </div>
                <button
                  onClick={() =>
                    addToCart({
                      ...product,
                      imageUrl: product.image,
                      quantity: 1,
                      newPrice: calculateConfiguredUnitPrice(product),
                    })
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:shadow-lg hover:scale-110 active:scale-95"
                  aria-label="Thêm vào giỏ"
                >
                  <FiShoppingCart size={15} />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
