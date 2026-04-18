import { useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  return (
    <article
      onClick={() => navigate(`/product/${product.id}`)}
      className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {(product.badges || []).slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-700"
            >
              {badge.replaceAll("_", " ")}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm text-slate-500">
          {product.category?.name} | {product.preparationTime} phut
        </div>
        <h3 className="mt-2 text-xl font-black text-slate-900">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
          {product.description}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-black text-orange-600">
              {product.newPrice.toLocaleString("vi-VN")} d
            </div>
            {product.originalPrice > product.newPrice && (
              <div className="text-sm text-slate-400 line-through">
                {product.originalPrice.toLocaleString("vi-VN")} d
              </div>
            )}
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              addToCart({
                ...product,
                imageUrl: product.image,
                quantity: 1,
              });
              setIsCartOpen(true);
            }}
            className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Them
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
