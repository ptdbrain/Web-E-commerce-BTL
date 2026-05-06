import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiCornerDownLeft } from "react-icons/fi";
import { getProducts } from "../../../api/productsApi";

export default function SearchBar() {
  const [q, setQ]               = useState("");
  const [results, setResults]   = useState([]);
  const [open, setOpen]         = useState(false);
  const [searching, setSearching] = useState(false);
  const timer    = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      setSearching(false);
      return;
    }

    setSearching(true);
    setOpen(true);

    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const products = await getProducts({ search: q.trim() });
        setResults(products.slice(0, 6));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer.current);
  }, [q]);

  return (
    <div
      className="relative w-full max-w-xl"
      onBlur={() => setTimeout(() => setOpen(false), 120)}
    >
      <div className="relative">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-11 pr-12 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] input-glow"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && q.trim()) {
              navigate(`/products?search=${encodeURIComponent(q.trim())}`);
              setOpen(false);
            }
          }}
          onFocus={() => q && setOpen(true)}
          placeholder="Tìm sản phẩm..."
          aria-label="Tìm kiếm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-300">
          <FiCornerDownLeft size={12} />
          <span className="text-[10px] font-medium">Enter</span>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card-hover animate-fade-in-down">
          <div className="max-h-[360px] overflow-y-auto">
            {searching ? (
              <div className="flex items-center justify-center gap-2 py-10">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                <span className="text-sm text-slate-400">Đang tìm kiếm...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <span className="text-3xl">🔍</span>
                <p className="mt-3 text-sm text-slate-400">Không tìm thấy sản phẩm phù hợp</p>
              </div>
            ) : (
              results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-orange-50/60"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-800">
                      {product.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs text-slate-400">{product.category?.name}</span>
                      <span className="text-xs font-bold text-orange-600">
                        {product.newPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {!searching && (
            <div className="border-t border-slate-100 p-2">
              <button
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  navigate(`/products?search=${encodeURIComponent(q.trim())}`);
                }}
              >
                Xem tất cả kết quả cho &ldquo;{q}&rdquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
