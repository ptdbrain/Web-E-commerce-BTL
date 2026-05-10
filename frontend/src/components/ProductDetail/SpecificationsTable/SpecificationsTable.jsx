import React, { useState } from "react";
import "./SpecificationsTable.css";

/**
 * SpecificationsTable Component
 * Hiển thị bảng thông số kỹ thuật chi tiết của sản phẩm
 */
export const SpecificationsTable = ({ specifications }) => {
  const [expandedSections, setExpandedSections] = useState({});

  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Tổ chức specs theo nhóm
  const organizeSpecs = (specs) => {
    const organized = {};

    // Nếu specs đã được tổ chức theo nhóm
    if (specs.general || specs.display || specs.performance) {
      return specs;
    }

    // Nếu specs là flat object, tổ chức lại
    organized.general = {};
    Object.entries(specs).forEach(([key, value]) => {
      organized.general[key] = value;
    });

    return organized;
  };

  const organizedSpecs = organizeSpecs(specifications);

  const sectionLabels = {
    general: "Thông tin chung",
    display: "Màn hình",
    performance: "Hiệu năng",
    memory: "Bộ nhớ",
    connectivity: "Kết nối",
    battery: "Pin & sạc",
    camera: "Camera",
    design: "Thiết kế",
    audio: "Âm thanh",
    other: "Khác",
  };

  return (
    <div className="specifications-table">
      <h2 className="specs-title">Thông số kỹ thuật</h2>

      <div className="specs-sections">
        {Object.entries(organizedSpecs).map(([sectionKey, sectionData]) => {
          const isExpanded = expandedSections[sectionKey] ?? true;
          const sectionLabel = sectionLabels[sectionKey] || sectionKey;

          return (
            <div key={sectionKey} className="spec-section">
              <button
                className="section-header"
                onClick={() => toggleSection(sectionKey)}
              >
                <h3>{sectionLabel}</h3>
                <span className={`arrow ${isExpanded ? "expanded" : ""}`}>
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className="section-content">
                  <table>
                    <tbody>
                      {Object.entries(sectionData).map(([key, value]) => (
                        <tr key={key}>
                          <td className="spec-label">{key}</td>
                          <td className="spec-value">
                            {Array.isArray(value) ? value.join(", ") : value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
