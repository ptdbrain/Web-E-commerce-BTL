import React, { useMemo } from "react";
import CheckboxFilter from "./CheckboxFilter";
import BrandFilter from "./BrandFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import { getFilterConfig } from "../../../data/filterConfigs";
import "./FilterSidebar.css";

const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
  brands = [],
  filterType = "default",
}) => {
  // Lấy cấu hình filter dựa trên filterType
  const filterConfig = useMemo(() => {
    return getFilterConfig(filterType);
  }, [filterType]);

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.priceRange !== null ||
    filters.rams.length > 0 ||
    filters.ssds.length > 0 ||
    filters.colors.length > 0;

  // Lấy options từ filterConfig
  const ramOptions = filterConfig.rams || [];
  const ssdOptions = filterConfig.ssds || [];
  const colorOptions = filterConfig.colors || [];

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h2 className="filter-main-title">BỘ LỌC</h2>
        {hasActiveFilters && (
          <button className="clear-all-btn" onClick={onClearFilters}>
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="filter-content">
        {/* Brand Filter - luôn hiển thị */}
        <BrandFilter
          selectedBrands={filters.brands}
          onBrandChange={(selected) => onFilterChange("brands", selected)}
          brands={brands}
        />

        {/* Price Range - luôn hiển thị */}
        <PriceRangeFilter
          selectedPriceRange={filters.priceRange}
          onPriceRangeChange={(range) => onFilterChange("priceRange", range)}
        />

        {/* RAM - chỉ cho laptop */}
        {ramOptions.length > 0 && (
          <CheckboxFilter
            title="Dung lượng RAM"
            options={ramOptions}
            selectedValues={filters.rams}
            onChange={(rams) => onFilterChange("rams", rams)}
            showAll={true}
          />
        )}

        {/* SSD - chỉ cho laptop */}
        {ssdOptions.length > 0 && (
          <CheckboxFilter
            title="Dung lượng ổ cứng"
            options={ssdOptions}
            selectedValues={filters.ssds}
            onChange={(ssds) => onFilterChange("ssds", ssds)}
            showAll={true}
          />
        )}

        {/* Màu sắc - cho các danh mục khác (không phải laptop) */}
        {colorOptions.length > 0 && (
          <CheckboxFilter
            title="Màu sắc"
            options={colorOptions}
            selectedValues={filters.colors}
            onChange={(colors) => onFilterChange("colors", colors)}
            showAll={true}
          />
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
