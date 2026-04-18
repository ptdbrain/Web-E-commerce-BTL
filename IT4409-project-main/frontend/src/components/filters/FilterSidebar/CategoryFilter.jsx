import React from "react";

const CategoryFilter = ({ selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className="filter-section">
      <h3 className="filter-title">DANH MỤC</h3>
      <div className="filter-options">
        <label className="filter-radio">
          <input
            type="radio"
            name="category"
            value="all"
            checked={selectedCategory === "all"}
            onChange={(e) => onCategoryChange(e.target.value)}
          />
          <span>
            Tất cả ({categories.reduce((sum, cat) => sum + cat.count, 0)})
          </span>
        </label>

        {categories.map((category) => (
          <label key={category.name} className="filter-radio">
            <input
              type="radio"
              name="category"
              value={category.name}
              checked={selectedCategory === category.name}
              onChange={(e) => onCategoryChange(e.target.value)}
            />
            <span>
              {category.name} ({category.count})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
