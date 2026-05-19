import React from "react";

const NestedCheckboxFilter = ({
  title,
  categories,
  selectedValues,
  onChange,
  emoji = "",
}) => {
  const [expanded, setExpanded] = React.useState({});

  const handleToggle = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const toggleCategory = (categoryName) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  return (
    <div className="filter-section">
      <h3 className="filter-title">
        {emoji} {title}
      </h3>
      <div className="filter-options nested-filter">
        {categories.map((category) => (
          <div key={category.name} className="filter-category">
            <button
              className="filter-category-header"
              onClick={() => toggleCategory(category.name)}
            >
              <span className="category-name">{category.name}</span>
              <span className="category-icon">
                {expanded[category.name] ? "−" : "+"}
              </span>
            </button>

            {expanded[category.name] && (
              <div className="filter-category-items">
                {category.options.map((option) => (
                  <label
                    key={option.value || option}
                    className="filter-checkbox nested"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value || option)}
                      onChange={() => handleToggle(option.value || option)}
                    />
                    <span>{option.label || option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NestedCheckboxFilter;
