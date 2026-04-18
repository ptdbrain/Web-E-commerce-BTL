import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { getFeaturedProducts } from "../../../api/productsApi";

function ProductSlide({ product }) {
  return (
    <div className="grid gap-6 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-card md:grid-cols-[0.95fr_1.05fr] md:items-center md:p-6">
      <Link to={`/product/${product.id}`} className="img-zoom rounded-[1.5rem] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-[260px] w-full rounded-[1.5rem] object-cover sm:h-[300px]"
          loading="eager"
          decoding="async"
        />
      </Link>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
          ✨ Featured combo
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-3 font-display text-2xl font-extrabold text-slate-900 transition-colors hover:text-orange-600 sm:text-3xl">
            {product.name}
          </h3>
        </Link>
        <p className="mt-3 text-slate-500 leading-relaxed line-clamp-3">
          {product.description}
        </p>
        {product.comboItems?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.comboItems.map((item) => (
              <span
                key={item}
                className="rounded-full bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
              >
                {item}
              </span>
            ))}
          </div>
        )}
        <div className="mt-6 flex items-center gap-3">
          <div className="text-3xl font-extrabold text-gradient font-display">
            {product.newPrice.toLocaleString("vi-VN")}đ
          </div>
          {product.originalPrice > product.newPrice && (
            <div className="text-lg text-slate-400 line-through">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </div>
          )}
        </div>
        <Link
          to={`/product/${product.id}`}
          className="mt-5 inline-flex rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedProductsSlider() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    getFeaturedProducts().then(setFeaturedProducts).catch(console.error);
  }, []);

  if (!featuredProducts.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={24}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="pb-10"
      >
        {featuredProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductSlide product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
