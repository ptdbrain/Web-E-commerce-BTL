import { useEffect, useState } from "react";
import { getProducts } from "../api/productsApi";
import ProductCard from "../components/product/ProductCard";

const TestProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 8)); // Lấy 8 sản phẩm đầu để test
      } catch (error) {
        console.error("Lỗi load sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Đang tải sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          🧪 Test Thẻ Sản Phẩm
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Hiển thị {products.length} sản phẩm từ mock data
        </p>

        {/* Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Hướng dẫn */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">✨ Tính năng có thể test:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Hover vào card → Phóng to + shadow</li>
            <li>✅ Click ❤️ → Thêm vào yêu thích (đỏ lên)</li>
            <li>✅ Click "Thêm vào giỏ" → Log console</li>
            <li>✅ Click vào card → Log "Xem chi tiết"</li>
            <li>✅ Badge động: -15%, MỚI, BÁN CHẠY, Còn 5</li>
            <li>✅ Responsive: Thử resize window</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestProductCard;
