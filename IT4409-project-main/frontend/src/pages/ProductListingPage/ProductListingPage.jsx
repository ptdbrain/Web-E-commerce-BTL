import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const ProductListingPage = () => {
  const { category: categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({
    priceRange: null,
    itemTypes: [],
    spiceLevels: [],
    featuredOnly: false,
    availableOnly: false,
  });

  const backendQuery = useMemo(
    () => ({
      search: searchQuery || "",
      category: categorySlug || "",
      itemType: filters.itemTypes.length === 1 ? filters.itemTypes[0] : "",
      spiceLevel: filters.spiceLevels.length === 1 ? filters.spiceLevels[0] : "",
      available: filters.availableOnly ? "true" : "",
      featured: filters.featuredOnly ? "true" : "",
    }),
    [
      categorySlug,
      filters.availableOnly,
      filters.featuredOnly,
      filters.itemTypes,
      filters.spiceLevels,
      searchQuery,
    ]
  );

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        setProducts(await getProducts(backendQuery));
      } catch (error) {
        console.error("Load menu error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [backendQuery]);

  useEffect(() => {
    setFilters({
      priceRange: null,
      itemTypes: [],
      spiceLevels: [],
      featuredOnly: false,
      availableOnly: false,
    });
    setSortBy("default");
    setItemsToShow(12);
  }, [categorySlug, searchQuery]);

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: "Trang chu", path: "/" },
      { label: "Menu", path: "/products" },
    ];

    if (searchQuery) {
      items.push({
        label: `Tim kiem: "${searchQuery}"`,
        path: `/products?search=${searchQuery}`,
      });
    } else if (categorySlug) {
      items.push({
        label: getCategoryDisplayName(categorySlug),
        path: `/products/${categorySlug}`,
      });
    }

    return items;
  }, [categorySlug, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.priceRange) {
      result = result.filter((product) => {
        const price = product.newPrice;
        return (
          price >= filters.priceRange.min && price <= filters.priceRange.max
        );
      });
    }

    if (filters.itemTypes.length > 0) {
      result = result.filter((product) =>
        filters.itemTypes.includes(product.itemType)
      );
    }

    if (filters.spiceLevels.length > 0) {
      result = result.filter((product) =>
        filters.spiceLevels.includes(product.spiceLevel)
      );
    }

    if (filters.featuredOnly) {
      result = result.filter((product) => product.isBestSeller || product.isNew);
    }

    if (filters.availableOnly) {
      result = result.filter((product) => product.isAvailable && product.stock > 0);
    }

    return result;
  }, [products, categorySlug, searchQuery, filters]);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        return result.sort((a, b) => a.newPrice - b.newPrice);
      case "rating":
        return result.sort((a, b) => b.rating - a.rating);
      case "bestseller":
        return result.sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          if (a.soldCount !== b.soldCount) return b.soldCount - a.soldCount;
          return b.reviewCount - a.reviewCount;
        });
      default:
        return result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return a.preparationTime - b.preparationTime;
        });
    }
  }, [filteredProducts, sortBy]);

  const displayedProducts = useMemo(
    () => sortedProducts.slice(0, itemsToShow),
    [sortedProducts, itemsToShow]
  );

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setItemsToShow((prev) => prev + 12);
      setLoadingMore(false);
    }, 250);
  }, []);

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      priceRange: null,
      itemTypes: [],
      spiceLevels: [],
      featuredOnly: false,
      availableOnly: false,
    });
  }, []);

  const pageTitle = searchQuery
    ? `Tim kiem: ${searchQuery}`
    : categorySlug
    ? getCategoryDisplayName(categorySlug)
    : "Toan bo menu";

  if (loading) {
    return (
      <div className="product-listing-page">
        <Breadcrumb items={breadcrumbItems} />
        <div className="plp-container">
          <aside className="filter-sidebar" style={{ opacity: 0.6 }}>
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  height: "30px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                  marginBottom: "20px",
                }}
              />
              <div
                style={{
                  height: "200px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              />
            </div>
          </aside>
          <main className="plp-main">
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

  return (
    <div className="product-listing-page">
      <SEO
        title={pageTitle}
        description={`${pageTitle} tai FireBite. Tim burger, ga ran, combo, do uong va dat mon nhanh.`}
        keywords={`fast food, burger, ga ran, combo, ${pageTitle.toLowerCase()}`}
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
            onSortChange={setSortBy}
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
              <h3>Khong tim thay mon phu hop</h3>
              <p>Hay doi bo loc hoac thu tu khoa khac.</p>
              <button className="clear-filter-btn" onClick={handleClearFilters}>
                Xoa bo loc
              </button>
            </div>
          )}

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

      <ScrollToTop showAfter={500} />
    </div>
  );
};

export default ProductListingPage;
