import React from "react";

const CheckboxFilter = ({
  title,
  options,
  selectedValues,
  onChange,
  showAll = false,
  emoji = "",
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const displayOptions = showAll || expanded ? options : options.slice(0, 5);

  const handleToggle = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div className="filter-section">
      <h3 className="filter-title">{title}</h3>
      <div className="filter-options">
        {displayOptions.map((option) => (
          <label key={option.value || option} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value || option)}
              onChange={() => handleToggle(option.value || option)}
            />
            <span>{option.label || option}</span>
          </label>
        ))}

        {options.length > 5 && !showAll && (
          <button
            className="filter-toggle-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Thu gọn" : `Xem thêm ${options.length - 5}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckboxFilter;
