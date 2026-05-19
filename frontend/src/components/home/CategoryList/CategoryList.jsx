import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../../../data/categories.jsx";

export function CategoryList({ selectedCategory, onSelectCategory }) {
  // Calculate columns so there are 2 rows: cols = ceil(n / 2)
  const cols = Math.max(4, Math.ceil(categories.length / 2));

  return (
    <div className="px-6 py-8 bg-white">
      <h2 className="text-3xl font-bold mb-6">Danh mục nổi bật</h2>

      <div
        className="grid gap-6 items-start"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products/${category.slug}`}
            onClick={() => onSelectCategory && onSelectCategory(category.id)}
            className="flex flex-col items-center gap-2 transition-transform duration-150 ease-in-out hover:-translate-y-1"
          >
            <div className="w-20 h-20 p-1 rounded-md flex items-center justify-center bg-white shadow-sm hover:bg-sky-50 hover:shadow-md transition-colors">
              <img
                src={category.image}
                alt={category.name}
                className="max-h-full object-contain"
              />
            </div>
            <span className="text-center text-sm font-semibold text-gray-800">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
