import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

// Cache for featured products
let featuredCache = null;

const ProductSlide = memo(function ProductSlide({ product }) {
  return (
    <div className="flex items-center justify-center gap-8 border border-gray-300 rounded-xl shadow-lg p-6 bg-white">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-1/2 max-h-[500px] object-contain rounded-lg border border-gray-200 shadow-md cursor-pointer"
          loading="eager"
          decoding="async"
        />
      </Link>

      <div className="flex flex-col items-start">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-3xl font-bold text-gray-800 mb-4 hover:text-blue-600 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-2xl text-orange-500 font-bold">
          {product.price.toLocaleString()}₫
        </p>
      </div>
    </div>
  );
});

export default function FeaturedProductsSlider() {
  const [featuredProducts, setFeaturedProducts] = useState(featuredCache || []);
  const [loading, setLoading] = useState(!featuredCache);

  useEffect(() => {
    if (featuredCache) return;

    const controller = new AbortController();
    const ids =
      "6953522a3f70bdfb6365b703,6953522a3f70bdfb6365b704,6953522a3f70bdfb6365b706";

    fetch(`https://it4409-deploy-backend.onrender.com/api/products/featured?ids=${ids}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        featuredCache = data;
        setFeaturedProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching featured products:", err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Không hiển thị gì khi đang loading hoặc không có sản phẩm
  if (loading) {
    return null;
  }

  if (
    !featuredProducts ||
    !Array.isArray(featuredProducts) ||
    featuredProducts.length === 0
  ) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
      >
        {featuredProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductSlide product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
