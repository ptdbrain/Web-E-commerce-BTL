// Trang danh sách sản phẩm: hỗ trợ tìm kiếm, lọc và sắp xếp server-side
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import ScrollToTop from "../../components/common/ScrollToTop";
import SEO from "../../components/common/SEO";
import FilterSidebar from "../../components/filters/FilterSidebar";
import ProductCard from "../../components/product/ProductCard";
import ProductCardSkeleton from "../../components/product/ProductCard/ProductCardSkeleton";
import ProductToolbar from "../../components/product/ProductToolbar";
import { getProducts } from "../../api/productsApi.js";
import { getCategoryDisplayName } from "../../data/categories.js";
import "./ProductListingPage.css";

// Map giá trị sort của toolbar → backend
const SORT_TO_BACKEND = {
  default:     "newest",
  "price-asc": "price_asc",
  rating:      "rating",
  bestseller:  "bestseller",
};

const DEFAULT_FILTERS = {
  priceRange:   null,
  itemTypes:    [],
  spiceLevels:  [],
  featuredOnly: false,
  availableOnly: false,
  minRating:    0,
};

// Đọc filter state từ URL params (dùng cho lazy useState)
const readFiltersFromUrl = (params) => ({
  priceRange: params.get("minPrice")
    ? { min: Number(params.get("minPrice")), max: params.get("maxPrice") ? Number(params.get("maxPrice")) : Infinity }
    : null,
  itemTypes:    params.get("itemType")?.split(",").filter(Boolean)   ?? [],
  spiceLevels:  params.get("spiceLevel")?.split(",").filter(Boolean) ?? [],
  featuredOnly: params.get("featured")  === "true",
  availableOnly: params.get("available") === "true",
  minRating:    Number(params.get("minRating")) || 0,
});

const ProductListingPage = () => {
  const { category: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [itemsToShow, setItemsToShow] = useState(12);

  // Khởi tạo từ URL params (lazy initializer chạy 1 lần khi mount)
  const [sortBy,  setSortBy]   = useState(() => searchParams.get("sort") || "default");
  const [filters, setFilters]  = useState(() => readFiltersFromUrl(searchParams));

  // Ref theo dõi category/search trước đó để phát hiện thay đổi (không reset khi mount)
  const prevCategoryRef = useRef(categorySlug);
  const prevSearchRef   = useRef(searchQuery);

  // Reset filters khi category hoặc search thay đổi (bỏ qua lần mount đầu)
  useEffect(() => {
    const categoryChanged = prevCategoryRef.current !== categorySlug;
    const searchChanged   = prevSearchRef.current   !== searchQuery;
    if (!categoryChanged && !searchChanged) return;
    prevCategoryRef.current = categorySlug;
    prevSearchRef.current   = searchQuery;
    setFilters(DEFAULT_FILTERS);
    setSortBy("default");
    setItemsToShow(12);
  }, [categorySlug, searchQuery]);

  // Sync filters + sort → URL (bỏ qua lần render đầu tiên)
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }

    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);

      if (sortBy && sortBy !== "default") p.set("sort", sortBy); else p.delete("sort");

      if (filters.priceRange) {
        p.set("minPrice", filters.priceRange.min);
        filters.priceRange.max !== Infinity
          ? p.set("maxPrice", filters.priceRange.max)
          : p.delete("maxPrice");
      } else {
        p.delete("minPrice");
        p.delete("maxPrice");
      }

      filters.itemTypes.length   ? p.set("itemType",   filters.itemTypes.join(","))   : p.delete("itemType");
      filters.spiceLevels.length ? p.set("spiceLevel", filters.spiceLevels.join(",")) : p.delete("spiceLevel");
      filters.featuredOnly       ? p.set("featured", "true")   : p.delete("featured");
      filters.availableOnly      ? p.set("available", "true")  : p.delete("available");
      filters.minRating > 0      ? p.set("minRating", filters.minRating) : p.delete("minRating");

      return p;
    }, { replace: true });
  }, [filters, sortBy, setSearchParams]);

  // Query gửi lên backend — tất cả filter/sort server-side, limit cao để lấy đủ data
  const backendQuery = useMemo(() => ({
    search:    searchQuery || "",
    category:  categorySlug || "",
    sort:      SORT_TO_BACKEND[sortBy] ?? "newest",
    itemType:  filters.itemTypes.join(","),
    spiceLevel: filters.spiceLevels.join(","),
    available: filters.availableOnly  ? "true" : "",
    featured:  filters.featuredOnly   ? "true" : "",
    minPrice:  filters.priceRange?.min,
    maxPrice:  filters.priceRange?.max !== Infinity ? filters.priceRange?.max : undefined,
    limit:     100,
  }), [categorySlug, searchQuery, sortBy, filters]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProducts(backendQuery);
        if (!cancelled) setProducts(data);
      } catch (err) {
        console.error("Load products error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [backendQuery]);

  // Chỉ còn filter client-side cho rating (chưa có trong backend)
  const filteredProducts = useMemo(() => {
    if (!filters.minRating) return products;
    return products.filter((p) => p.rating >= filters.minRating);
  }, [products, filters.minRating]);

  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, itemsToShow),
    [filteredProducts, itemsToShow]
  );

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: "Trang chủ", path: "/" },
      { label: "Sản phẩm", path: "/products" },
    ];
    if (searchQuery) {
      items.push({ label: `Tìm kiếm: "${searchQuery}"`, path: `/products?search=${encodeURIComponent(searchQuery)}` });
    } else if (categorySlug) {
      items.push({ label: getCategoryDisplayName(categorySlug), path: `/products/${categorySlug}` });
    }
    return items;
  }, [categorySlug, searchQuery]);

  const handleLoadMore = useCallback(() => {
    setItemsToShow((prev) => prev + 12);
  }, []);

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setItemsToShow(12);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setItemsToShow(12);
  }, []);

  const pageTitle = searchQuery
    ? `Tìm kiếm: "${searchQuery}"`
    : categorySlug
    ? getCategoryDisplayName(categorySlug)
    : "Toàn bộ sản phẩm";

  if (loading) {
    return (
      <div className="product-listing-page">
        <Breadcrumb items={breadcrumbItems} />
        <div className="plp-container">
          <aside className="filter-sidebar" style={{ opacity: 0.5 }}>
            <div style={{ padding: "20px" }}>
              <div style={{ height: "30px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "20px" }} />
              <div style={{ height: "220px", background: "#f0f0f0", borderRadius: "4px" }} />
            </div>
          </aside>
          <main className="plp-main">
            <div className="plp-grid">
              {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="product-listing-page">
      <SEO
        title={pageTitle}
        description={`${pageTitle} tại FireBite — burger, gà rán, đồ uống và combo giao nhanh.`}
        keywords={`${pageTitle.toLowerCase()}, đồ ăn, fast food, FireBite`}
      />

      <Breadcrumb items={breadcrumbItems} />

      <div className="plp-container">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <main className="plp-main">
          <ProductToolbar
            totalProducts={filteredProducts.length}
            sortBy={sortBy}
            onSortChange={(val) => { setSortBy(val); setItemsToShow(12); }}
          />

          {displayedProducts.length > 0 ? (
            <div className="plp-grid">
              {displayedProducts.map((product) => (
                <div key={product.id} className="product-card-wrapper">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="plp-empty">
              <h3>Không tìm thấy sản phẩm phù hợp</h3>
              <p>Hãy đổi bộ lọc hoặc thử từ khóa khác.</p>
              <button className="clear-filter-btn" onClick={handleClearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          )}

          {filteredProducts.length > itemsToShow && (
            <LoadMoreButton
              currentCount={displayedProducts.length}
              totalCount={filteredProducts.length}
              onLoadMore={handleLoadMore}
              isLoading={false}
            />
          )}
        </main>
      </div>

      <ScrollToTop showAfter={500} />
    </div>
  );
};

export default ProductListingPage;
