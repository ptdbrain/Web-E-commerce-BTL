import React, { useState, useRef, useEffect } from "react";
import "./ProductToolbar.css";

const ProductToolbar = ({ totalProducts, sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: "default", label: "Mặc định" },
    { value: "price-asc", label: "Giá: Thấp → Cao" },
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "bestseller", label: "Bán chạy nhất" },
  ];

  const currentOption = sortOptions.find((opt) => opt.value === sortBy);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOption = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="product-toolbar">
      <div className="toolbar-left">
        <span className="product-count">
          <strong>{totalProducts}</strong> sản phẩm
        </span>
      </div>

      <div className="toolbar-right">
        <div className="sort-dropdown" ref={dropdownRef}>
          <button
            className="sort-button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <span className="sort-label">Sắp xếp:</span>
            <span className="sort-current">
              {currentOption.icon} {currentOption.label}
            </span>
            <span className={`sort-arrow ${isOpen ? "open" : ""}`}>▼</span>
          </button>

          {isOpen && (
            <div className="sort-menu">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`sort-option ${
                    sortBy === option.value ? "active" : ""
                  }`}
                  onClick={() => handleSelectOption(option.value)}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                  {sortBy === option.value && (
                    <span className="option-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
