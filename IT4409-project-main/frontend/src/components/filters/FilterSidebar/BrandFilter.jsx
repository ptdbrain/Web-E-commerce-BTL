import React, { useState } from "react";

const BrandFilter = ({ selectedBrands = [], onBrandChange, brands = [] }) => {
  const [showAll, setShowAll] = useState(false);

  // Sử dụng trực tiếp brands từ props (đã được lọc theo category)
  const displayBrands = showAll ? brands : brands.slice(0, 5);

  const handleBrandToggle = (brandName) => {
    const isSelected = selectedBrands.includes(brandName);
    if (isSelected) {
      onBrandChange(selectedBrands.filter((b) => b !== brandName));
    } else {
      onBrandChange([...selectedBrands, brandName]);
    }
  };

  if (!brands || brands.length === 0) {
    return null; // Không hiện nếu không có brands
  }

  return (
    <div className="filter-section">
      <h3 className="filter-title">THƯƠNG HIỆU</h3>
      <div className="filter-options">
        {displayBrands.map((brand) => {
          const name = typeof brand === "string" ? brand : brand.name || "";
          const count = typeof brand === "object" ? brand.count || 0 : 0;
          if (!name) return null;

          return (
            <label key={name} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedBrands.includes(name)}
                onChange={() => handleBrandToggle(name)}
              />
              <span>
                {name} {count > 0 && `(${count})`}
              </span>
            </label>
          );
        })}

        {brands.length > 5 && (
          <button
            className="filter-toggle-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Thu gọn" : `Xem thêm ${brands.length - 5}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default BrandFilter;
