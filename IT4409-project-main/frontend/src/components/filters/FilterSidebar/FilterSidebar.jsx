import React from "react";
import "./FilterSidebar.css";

const PRICE_PRESETS = [
  { label: "Dưới 50.000đ",          value: { min: 0,      max: 50000  } },
  { label: "50.000đ – 100.000đ",    value: { min: 50000,  max: 100000 } },
  { label: "100.000đ – 200.000đ",   value: { min: 100000, max: 200000 } },
  { label: "Trên 200.000đ",         value: { min: 200000, max: Infinity } },
];

const ITEM_TYPE_OPTIONS = [
  { value: "single",  label: "Sản phẩm đơn" },
  { value: "combo",   label: "Combo" },
  { value: "drink",   label: "Đồ uống" },
  { value: "side",    label: "Phụ kiện" },
  { value: "dessert", label: "Khác" },
];

const SPICE_LEVEL_OPTIONS = [
  { value: "none",   label: "Không cay" },
  { value: "mild",   label: "Cay nhẹ"  },
  { value: "medium", label: "Cay vừa"  },
  { value: "hot",    label: "Rất cay"  },
];

const RATING_OPTIONS = [
  { value: 4, label: "Từ 4★ trở lên" },
  { value: 3, label: "Từ 3★ trở lên" },
  { value: 2, label: "Từ 2★ trở lên" },
];

const toggleValue = (values, target) =>
  values.includes(target)
    ? values.filter((v) => v !== target)
    : [...values, target];

const samePriceRange = (a, b) => a?.min === b?.min && a?.max === b?.max;

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const hasActiveFilters =
    filters.itemTypes.length > 0   ||
    filters.spiceLevels.length > 0  ||
    filters.priceRange !== null      ||
    filters.featuredOnly             ||
    filters.availableOnly            ||
    filters.minRating > 0;

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h2 className="filter-main-title">Bộ lọc</h2>
        {hasActiveFilters && (
          <button className="clear-all-btn" onClick={onClearFilters}>
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="filter-content space-y-6">

        {/* Loại sản phẩm */}
        <div>
          <h3 className="filter-title">Loại sản phẩm</h3>
          <div className="space-y-2">
            {ITEM_TYPE_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.itemTypes.includes(opt.value)}
                  onChange={() => onFilterChange("itemTypes", toggleValue(filters.itemTypes, opt.value))}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Khoảng giá */}
        <div>
          <h3 className="filter-title">Khoảng giá</h3>
          <div className="space-y-2">
            {PRICE_PRESETS.map((preset) => (
              <label key={preset.label} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  checked={samePriceRange(filters.priceRange, preset.value)}
                  onChange={() => onFilterChange("priceRange", preset.value)}
                />
                <span>{preset.label}</span>
              </label>
            ))}
            {filters.priceRange && (
              <button
                onClick={() => onFilterChange("priceRange", null)}
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Bỏ chọn giá
              </button>
            )}
          </div>
        </div>

        {/* Đánh giá */}
        <div>
          <h3 className="filter-title">Đánh giá</h3>
          <div className="space-y-2">
            {RATING_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="minRating"
                  checked={filters.minRating === opt.value}
                  onChange={() => onFilterChange("minRating", opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
            {filters.minRating > 0 && (
              <button
                onClick={() => onFilterChange("minRating", 0)}
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Bỏ chọn đánh giá
              </button>
            )}
          </div>
        </div>

        {/* Độ cay */}
        <div>
          <h3 className="filter-title">Độ cay</h3>
          <div className="space-y-2">
            {SPICE_LEVEL_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.spiceLevels.includes(opt.value)}
                  onChange={() => onFilterChange("spiceLevels", toggleValue(filters.spiceLevels, opt.value))}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Trạng thái */}
        <div>
          <h3 className="filter-title">Trạng thái</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={() => onFilterChange("availableOnly", !filters.availableOnly)}
              />
              <span>Chỉ hiện sản phẩm còn hàng</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.featuredOnly}
                onChange={() => onFilterChange("featuredOnly", !filters.featuredOnly)}
              />
              <span>Chỉ hiện sản phẩm nổi bật</span>
            </label>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default FilterSidebar;
