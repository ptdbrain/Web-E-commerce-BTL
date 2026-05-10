import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/productsApi";
import ProductCard from "../../components/product/ProductCard";
import ProductCardSkeleton from "../../components/product/ProductCard/ProductCardSkeleton";
import Breadcrumb from "../../components/common/Breadcrumb";
import FilterSidebar from "../../components/filters/FilterSidebar";
import ProductToolbar from "../../components/product/ProductToolbar";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import ScrollToTop from "../../components/common/ScrollToTop";
import SEO from "../../components/common/SEO";
import { getFilterTypeBySlug } from "../../data/filterConfigs";
import {
  slugToCategoryName,
  getCategoryDisplayName,
} from "../../data/categories";
import "./ProductListingPage.css";

const ProductListingPage = () => {
  const { category: categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const brandFromUrl = searchParams.get("brand");
  const modelFromUrl = searchParams.get("model");
  const searchQuery = searchParams.get("search");

  // Lấy filterType từ slug
  const filterType = useMemo(() => {
    if (!categorySlug) return "default";
    return getFilterTypeBySlug(categorySlug) || "default";
  }, [categorySlug]);

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);

  // Sort state
  const [sortBy, setSortBy] = useState("default");

  // Filter state - Đơn giản hóa chỉ còn: brands, price, RAM/SSD (laptop), colors (others)
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: null,
    rams: [],
    ssds: [],
    colors: [],
  });

  // Category name mapping
  const categoryNames = {
    laptop: "Laptop",
    phone: "Điện thoại",
    tablet: "Máy tính bảng",
    keyboard: "Bàn phím",
    mouse: "Chuột",
    headphone: "Tai nghe",
  };

  // Helper function: kiểm tra product có thuộc category slug không
  const matchCategory = useCallback((product, slug) => {
    if (!slug) return true;

    // Lấy category name từ product (có thể là string hoặc object)
    let productCategory = "";
    if (typeof product.category === "string") {
      productCategory = product.category;
    } else if (product.category?.name) {
      productCategory = product.category.name;
    }

    if (!productCategory) return false;

    const productCatLower = productCategory.toLowerCase();
    const slugLower = slug.toLowerCase();

    // Lấy tên category từ mapping
    const targetCategoryName = slugToCategoryName[slugLower];

    if (targetCategoryName) {
      // So sánh với tên category từ mapping
      const targetLower = targetCategoryName.toLowerCase();
      if (
        productCatLower === targetLower ||
        productCatLower.includes(targetLower) ||
        targetLower.includes(productCatLower)
      ) {
        return true;
      }
    }

    // Fallback: so sánh trực tiếp slug với category name
    // Ví dụ: slug "laptop-nhap-khau" vs category "Laptop nhập khẩu"
    const normalizedSlug = slugLower.replace(/-/g, " ");
    if (
      productCatLower.includes(normalizedSlug) ||
      normalizedSlug.includes(productCatLower)
    ) {
      return true;
    }

    // Fallback cho laptop: nếu slug chứa "laptop", match tất cả laptop categories
    if (slugLower.includes("laptop") && productCatLower.includes("laptop")) {
      return true;
    }

    return false;
  }, []);

  // Dynamic Breadcrumb
  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: "Trang chủ", path: "/" },
      { label: "Sản phẩm", path: "/products" },
    ];

    if (searchQuery) {
      items.push({
        label: `Tìm kiếm: "${searchQuery}"`,
        path: `/products?search=${searchQuery}`,
      });
    } else if (categorySlug) {
      // Sử dụng getCategoryDisplayName để lấy tên hiển thị đúng
      const categoryLabel = getCategoryDisplayName(categorySlug);
      items.push({
        label: categoryLabel,
        path: `/products/${categorySlug}`,
      });
    }

    return items;
  }, [categorySlug, searchQuery]);

  // Lọc sản phẩm theo category trước để lấy brands đúng
  const categoryFilteredProducts = useMemo(() => {
    if (!categorySlug) return products;
    return products.filter((p) => matchCategory(p, categorySlug));
  }, [products, categorySlug, matchCategory]);

  // Calculate brands from category-filtered products
  const brandsData = useMemo(() => {
    const brandCount = {};
    categoryFilteredProducts.forEach((product) => {
      if (product.brand) {
        brandCount[product.brand] = (brandCount[product.brand] || 0) + 1;
      }
    });
    return Object.entries(brandCount)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .filter((b) => b.name) // Loại bỏ brand rỗng
      .sort((a, b) => b.count - a.count);
  }, [categoryFilteredProducts]);

  // Filter products - Lọc theo tất cả bộ lọc mới
  const filteredProducts = useMemo(() => {
    // Step 1: Filter by URL category first
    let result = categorySlug
      ? products.filter((p) => matchCategory(p, categorySlug))
      : [...products];

    // Step 2: Filter by search query from URL
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const brand = (p.brand || "").toLowerCase();
        // Lấy category name đúng cách
        let categoryValue = "";
        if (typeof p.category === "string") {
          categoryValue = p.category.toLowerCase();
        } else if (p.category?.name) {
          categoryValue = p.category.name.toLowerCase();
        }

        return (
          name.includes(query) ||
          brand.includes(query) ||
          categoryValue.includes(query)
        );
      });
    }

    // Step 3: Filter by brands - ƯU TIÊN sidebar filter, nếu không có thì dùng URL
    // Nếu user đã chọn brand từ sidebar → dùng sidebar filter
    // Nếu không có sidebar filter nhưng có brandFromUrl → dùng URL filter
    if (filters.brands.length > 0) {
      // User đã chọn brands từ sidebar - chỉ dùng sidebar filter
      result = result.filter((p) => {
        const productBrand = (p.brand || "").toLowerCase();
        return filters.brands.some(
          (selectedBrand) => selectedBrand.toLowerCase() === productBrand
        );
      });
    } else if (brandFromUrl) {
      // Không có sidebar filter, dùng URL brand
      result = result.filter(
        (p) => (p.brand || "").toLowerCase() === brandFromUrl.toLowerCase()
      );
    }

    // Step 4: Filter by model from URL (search in product name)
    if (modelFromUrl) {
      const modelQuery = modelFromUrl.toLowerCase();
      result = result.filter((p) =>
        (p.name || "").toLowerCase().includes(modelQuery)
      );
    }

    // Step 5: Filter by price range
    if (filters.priceRange) {
      result = result.filter(
        (p) =>
          p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    }

    // Step 6: Filter by RAM options (chỉ áp dụng cho Laptop)
    if (filters.rams.length > 0) {
      result = result.filter((p) => {
        // Tìm RAM trong nhiều vị trí có thể
        const ram = p.specs?.ram || p.specs?.RAM || p.specs?.memory || "";
        if (!ram) return false;

        // Trích xuất số GB từ chuỗi RAM
        const ramMatch = ram.match(/(\d+)\s*GB/i);
        if (!ramMatch) return false;
        const ramGB = ramMatch[1];

        return filters.rams.some((opt) => {
          // Trích xuất số GB từ option filter
          const optMatch = opt.match(/(\d+)/);
          if (!optMatch) return false;
          return ramGB === optMatch[1];
        });
      });
    }

    // Step 8: Filter by SSD/storage options (chỉ áp dụng cho Laptop)
    if (filters.ssds.length > 0) {
      result = result.filter((p) => {
        const storage =
          p.specs?.storage ||
          p.specs?.ssd ||
          p.specs?.SSD ||
          p.specs?.hardDrive ||
          "";
        if (!storage) return false;

        // Trích xuất dung lượng từ chuỗi storage
        const storageLower = storage.toLowerCase();

        return filters.ssds.some((opt) => {
          const optLower = opt.toLowerCase();
          // So sánh trực tiếp hoặc trích xuất số
          if (
            storageLower.includes(optLower.replace(/\s/g, "")) ||
            storageLower.includes(optLower)
          ) {
            return true;
          }
          // Trích xuất số và đơn vị
          const optMatch = opt.match(/(\d+)\s*(GB|TB)/i);
          if (!optMatch) return false;
          const optNum = optMatch[1];
          const optUnit = optMatch[2].toUpperCase();
          return (
            storageLower.includes(optNum) &&
            storageLower.toUpperCase().includes(optUnit)
          );
        });
      });
    }

    // Step 9: Filter by colors (áp dụng cho các danh mục không phải Laptop)
    if (filters.colors.length > 0) {
      result = result.filter((p) => {
        const color = p.color || p.specs?.color || "";
        if (!color) return false;
        const colorLower = color.toLowerCase();
        return filters.colors.some((opt) =>
          colorLower.includes(opt.toLowerCase())
        );
      });
    }

    return result;
  }, [
    products,
    filters,
    categorySlug,
    brandFromUrl,
    modelFromUrl,
    searchQuery,
    matchCategory,
  ]);

  // Sort products
  const sortedProducts = useMemo(() => {
    let result = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);

      case "rating":
        return result.sort((a, b) => b.rating - a.rating);

      case "bestseller":
        return result.sort((a, b) => {
          // Ưu tiên isBestSeller trước
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          // Nếu cùng isBestSeller, sort theo số reviews
          return b.reviews - a.reviews;
        });

      case "default":
      default:
        return result; // Giữ nguyên thứ tự
    }
  }, [filteredProducts, sortBy]);

  // Reset filters when category changes (nhưng KHÔNG reset khi chỉ brandFromUrl thay đổi)
  useEffect(() => {
    setFilters({
      brands: [],
      priceRange: null,
      rams: [],
      ssds: [],
      colors: [],
    });
    setSortBy("default");
    setItemsToShow(12);
  }, [categorySlug, modelFromUrl]);

  // Khi có brandFromUrl và brandsData đã load, pre-select brand đó trong filter
  useEffect(() => {
    if (brandFromUrl && brandsData.length > 0) {
      // Tìm brand chính xác trong brandsData
      const matchedBrand = brandsData.find(
        (b) => b.name.toLowerCase() === brandFromUrl.toLowerCase()
      );
      if (matchedBrand) {
        setFilters((prev) => {
          // Chỉ set nếu chưa có brand nào được chọn hoặc brand URL chưa được chọn
          if (prev.brands.length === 0) {
            return {
              ...prev,
              brands: [matchedBrand.name],
            };
          }
          return prev;
        });
      }
    }
  }, [brandFromUrl, brandsData]);

  // Update displayed products when sorted products or itemsToShow changes
  useEffect(() => {
    setDisplayedProducts(sortedProducts.slice(0, itemsToShow));
  }, [sortedProducts, itemsToShow]);

  // Handle Load More - use useCallback to prevent recreation
  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);

    // Simulate loading delay (optional - có thể bỏ)
    setTimeout(() => {
      setItemsToShow((prev) => prev + 12);
      setLoadingMore(false);
    }, 300);
  }, []);

  // Handle filter changes - use useCallback
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  // Clear all filters - use useCallback
  const handleClearFilters = useCallback(() => {
    setFilters({
      brands: [],
      priceRange: null,
      rams: [],
      ssds: [],
      colors: [],
    });
  }, []);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi load sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="product-listing-page">
        <Breadcrumb items={breadcrumbItems} />

        <div className="plp-container">
          {/* Filter Sidebar Skeleton */}
          <aside className="filter-sidebar" style={{ opacity: 0.6 }}>
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  height: "30px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                  marginBottom: "20px",
                }}
              ></div>
              <div
                style={{
                  height: "200px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </aside>

          <main className="plp-main">
            {/* Toolbar Skeleton */}
            <div
              style={{
                height: "60px",
                background: "#f9fafb",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            ></div>

            {/* Product Grid Skeleton */}
            <div className="plp-grid">
              {[...Array(12)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Tạo title và description động dựa trên category và search
  const pageTitle = searchQuery
    ? `Tìm kiếm: ${searchQuery}`
    : categorySlug
    ? `${categoryNames[categorySlug] || categorySlug}`
    : "Tất cả sản phẩm";

  const pageDescription = searchQuery
    ? `Kết quả tìm kiếm cho "${searchQuery}" - ${filteredProducts.length} sản phẩm`
    : categorySlug
    ? `Danh sách ${
        categoryNames[categorySlug] || categorySlug
      } chính hãng, giá tốt nhất. ${filteredProducts.length} sản phẩm.`
    : `Khám phá ${filteredProducts.length} sản phẩm công nghệ chính hãng.`;

  return (
    <div className="product-listing-page">
      {/* ===== SEO META TAGS ===== */}
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${categorySlug || "sản phẩm"}, ${
          searchQuery || ""
        }, laptop, pc, công nghệ, tech geeks`}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main Container */}
      <div className="plp-container">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          brands={brandsData}
          filterType={filterType}
        />

        {/* Main Content */}
        <main className="plp-main">
          {/* Toolbar with Sort */}
          <ProductToolbar
            totalProducts={filteredProducts.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Product Grid */}
          {displayedProducts.length > 0 ? (
            <div className="plp-grid">
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card-wrapper"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="plp-empty">
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Vui lòng thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
              <button className="clear-filter-btn" onClick={handleClearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Load More Button */}
          {displayedProducts.length > 0 && (
            <LoadMoreButton
              currentCount={displayedProducts.length}
              totalCount={sortedProducts.length}
              onLoadMore={handleLoadMore}
              isLoading={loadingMore}
            />
          )}
        </main>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop showAfter={500} />
    </div>
  );
};

export default ProductListingPage;
