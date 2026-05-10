import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://it4409-deploy-backend.onrender.com/api/products?search=${encodeURIComponent(
            q
          )}&limit=10`
        );
        if (!res.ok) return;
        const data = await res.json();
        // assume API returns array of products
        setResults(Array.isArray(data) ? data : data.products || []);
        setOpen(true);
      } catch (err) {
        console.error("search error", err);
      }
    }, 250);

    return () => clearTimeout(timer.current);
  }, [q]);

  return (
    <div
      className="search-wrapper"
      onBlur={() => setTimeout(() => setOpen(false), 120)}
    >
      <input
        className="search-input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // navigate to listing page with search query
            navigate(`/products?search=${encodeURIComponent(q)}`);
            setOpen(false);
          }
        }}
        onFocus={() => q && setOpen(true)}
        placeholder="Tìm sản phẩm, thương hiệu, model..."
        aria-label="search"
      />

      {open && (
        <div className="suggestions-dropdown" role="listbox">
          <div className="suggestions-list">
            {results.length === 0 ? (
              <div className="suggestions-empty">
                <div className="empty-icon">🔍</div>
                <p>Không tìm thấy kết quả</p>
              </div>
            ) : (
              results.map((p) => {
                // Xử lý brand có thể là string hoặc object {_id, name}
                const brandName =
                  typeof p.brand === "string" ? p.brand : p.brand?.name || "";
                // Xử lý price - có thể là discountPrice hoặc price
                const displayPrice = p.discountPrice || p.price;

                return (
                  <Link
                    key={p._id || p.id}
                    to={`/product/${p._id || p.id}`}
                    className="suggestion-item"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="suggestion-image">
                      <img
                        src={p.images?.[0] || "/placeholder.png"}
                        alt={p.name}
                        className="optimized-image"
                      />
                    </div>
                    <div className="suggestion-info">
                      <div className="suggestion-name">{p.name}</div>
                      <div className="suggestion-meta">
                        <div className="suggestion-brand">{brandName}</div>
                        <div className="suggestion-price">
                          {typeof displayPrice === "number"
                            ? displayPrice.toLocaleString("vi-VN") + " đ"
                            : displayPrice}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          <div className="suggestions-footer">
            <button
              className="view-all-button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setOpen(false);
                navigate(`/products?search=${encodeURIComponent(q)}`);
              }}
            >
              Xem tất cả kết quả cho "{q}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
