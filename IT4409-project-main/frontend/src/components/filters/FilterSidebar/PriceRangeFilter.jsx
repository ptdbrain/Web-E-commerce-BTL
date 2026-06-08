import React from "react";

const PriceRangeFilter = ({ selectedPriceRange, onPriceRangeChange }) => {
  const priceRanges = [
    { label: "Tất cả", min: 0, max: Infinity },
    { label: "Dưới 50.000đ", min: 0, max: 50000 },
    { label: "50.000đ - 100.000đ", min: 50000, max: 100000 },
    { label: "100.000đ - 200.000đ", min: 100000, max: 200000 },
    { label: "Trên 200.000đ", min: 200000, max: Infinity },
  ];

  const handleRangeSelect = (range) => {
    onPriceRangeChange(range);
  };

  const isSelected = (range) => {
    if (!selectedPriceRange) return range.min === 0 && range.max === Infinity;
    return (
      selectedPriceRange.min === range.min &&
      selectedPriceRange.max === range.max
    );
  };

  return (
    <div className="filter-section">
      <h3 className="filter-title">KHOANG GIA</h3>
      <div className="filter-options">
        {priceRanges.map((range) => (
          <label key={`${range.min}-${range.max}`} className="filter-radio">
            <input
              type="radio"
              name="priceRange"
              checked={isSelected(range)}
              onChange={() => handleRangeSelect(range)}
            />
            <span>{range.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeFilter;
