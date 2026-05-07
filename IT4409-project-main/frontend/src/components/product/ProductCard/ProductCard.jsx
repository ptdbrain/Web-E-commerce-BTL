import { useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const hasRating = product.rating > 0;

  return (
    <article
      onClick={() => navigate(`/product/${product.id}`)}
      className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Ảnh + badges + rating badge */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover"
        />

        {/* Badges — góc trên trái */}
        {(product.badges || []).length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-700 backdrop-blur-sm"
              >
                {badge.replaceAll("_", " ")}
              </span>
            ))}
          </div>
        )}

        {/* Rating badge — góc dưới trái ảnh */}
        {hasRating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
            <span className="text-xs text-yellow-400">★</span>
            <span className="text-xs font-semibold text-white">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount > 0 && (
              <span className="text-[10px] text-white/70">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-sm text-slate-500">
          {product.category?.name}
          {product.preparationTime > 0 && ` · ${product.preparationTime} phút`}
        </div>
        <h3 className="mt-2 text-xl font-black text-slate-900 line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">
          {product.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-black text-orange-600">
              {product.newPrice.toLocaleString("vi-VN")}đ
            </div>
            {product.originalPrice > product.newPrice && (
              <div className="text-sm text-slate-400 line-through">
                {product.originalPrice.toLocaleString("vi-VN")}đ
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ ...product, imageUrl: product.image, quantity: 1 });
              setIsCartOpen(true);
            }}
            className="shrink-0 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
          >
            Thêm
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
