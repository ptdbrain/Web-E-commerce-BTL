import React from "react";
import "./FilterSidebar.css";

const PRICE_PRESETS = [
  { label: "Duoi 50.000d", value: { min: 0, max: 50000 } },
  { label: "50.000d - 100.000d", value: { min: 50000, max: 100000 } },
  { label: "100.000d - 200.000d", value: { min: 100000, max: 200000 } },
  { label: "Tren 200.000d", value: { min: 200000, max: Infinity } },
];

const checkboxOptions = {
  itemTypes: [
    { value: "single", label: "Mon le" },
    { value: "combo", label: "Combo" },
    { value: "drink", label: "Do uong" },
    { value: "side", label: "Mon phu" },
    { value: "dessert", label: "Trang mieng" },
  ],
  spiceLevels: [
    { value: "none", label: "Khong cay" },
    { value: "mild", label: "Cay nhe" },
    { value: "medium", label: "Cay vua" },
    { value: "hot", label: "Rat cay" },
  ],
};

const toggleValue = (values, target) =>
  values.includes(target)
    ? values.filter((value) => value !== target)
    : [...values, target];

const samePriceRange = (left, right) =>
  left?.min === right?.min && left?.max === right?.max;

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const hasActiveFilters =
    filters.itemTypes.length > 0 ||
    filters.spiceLevels.length > 0 ||
    filters.priceRange !== null ||
    filters.featuredOnly ||
    filters.availableOnly;

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h2 className="filter-main-title">Bo loc menu</h2>
        {hasActiveFilters && (
          <button className="clear-all-btn" onClick={onClearFilters}>
            Xoa tat ca
          </button>
        )}
      </div>

      <div className="filter-content space-y-6">
        <div>
          <h3 className="filter-title">Loai mon</h3>
          <div className="space-y-2">
            {checkboxOptions.itemTypes.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.itemTypes.includes(option.value)}
                  onChange={() =>
                    onFilterChange(
                      "itemTypes",
                      toggleValue(filters.itemTypes, option.value)
                    )
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="filter-title">Do cay</h3>
          <div className="space-y-2">
            {checkboxOptions.spiceLevels.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.spiceLevels.includes(option.value)}
                  onChange={() =>
                    onFilterChange(
                      "spiceLevels",
                      toggleValue(filters.spiceLevels, option.value)
                    )
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="filter-title">Khoang gia</h3>
          <div className="space-y-2">
            {PRICE_PRESETS.map((preset) => (
              <label key={preset.label} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="priceRange"
                  checked={samePriceRange(filters.priceRange, preset.value)}
                  onChange={() => onFilterChange("priceRange", preset.value)}
                />
                <span>{preset.label}</span>
              </label>
            ))}
            <button
              onClick={() => onFilterChange("priceRange", null)}
              className="text-sm font-medium text-orange-600"
            >
              Bo chon gia
            </button>
          </div>
        </div>

        <div>
          <h3 className="filter-title">Trang thai</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={() =>
                  onFilterChange("availableOnly", !filters.availableOnly)
                }
              />
              <span>Chi hien mon dang phuc vu</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.featuredOnly}
                onChange={() => onFilterChange("featuredOnly", !filters.featuredOnly)}
              />
              <span>Chi hien mon noi bat</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
