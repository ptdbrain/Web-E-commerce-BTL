import React, { useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiClock,
  FiMapPin,
  FiMenu,
  FiShield,
  FiShoppingCart,
  FiUser,
  FiX,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { categories } from "../../../data/categories";
import { storeConfig } from "../../../data/menuData";
import { useCart } from "../../../hooks/useCart";
import SearchBar from "../SearchBar/SearchBar";
import { CartPopup } from "../../cart/CartPopup";

function Header() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("authChanged", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("authChanged", syncUser);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
    window.dispatchEvent(new Event("authChanged"));
    setUser(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-orange-100/50"
          : "bg-white border-b border-orange-100"
      }`}
    >
      {/* Top bar */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-rose-500 px-6 py-1.5 text-xs text-orange-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <FiClock className="text-orange-200" size={12} />
            <span>{storeConfig.hours}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiMapPin className="text-orange-200" size={12} />
            <span className="hidden sm:inline">{storeConfig.address}</span>
            <span className="sm:hidden">Hai Ba Trung, HN</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-1"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-gradient">
              Fire
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-slate-800 group-hover:text-orange-600 transition-colors">
              Bite
            </span>
          </button>

          {/* Categories dropdown — desktop */}
          <div className="relative hidden lg:block" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                menuOpen
                  ? "bg-orange-50 text-orange-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <FiMenu size={16} />
              <span>Thực đơn</span>
              <FiChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-full mt-2 w-[420px] rounded-2xl border border-slate-100 bg-white p-4 shadow-card-hover animate-fade-in-down z-50">
                <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Danh mục nổi bật
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        navigate(`/products/${category.slug}`);
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-orange-50 hover:shadow-sm group"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-7 w-7 object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                          {category.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Xem danh mục
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search — desktop */}
        <div className="hidden flex-1 lg:block">
          <SearchBar />
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Phone — desktop */}
          <div className="hidden text-right text-xs lg:block mr-2">
            <div className="font-semibold text-slate-700">{storeConfig.phone}</div>
            <div className="text-slate-400">Giao hàng • Pickup</div>
          </div>

          {/* User menu */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  userMenuOpen
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-xs font-bold text-white">
                  {(user.fullname || user.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <span className="hidden max-w-[120px] truncate sm:inline">
                  {user.fullname || "Tài khoản"}
                </span>
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-card-hover animate-fade-in-down z-50">
                  <div className="px-3 py-2 mb-1 border-b border-slate-100">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {user.fullname || user.username}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {user.email || ""}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  >
                    <FiUser size={15} />
                    Hồ sơ của tôi
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/orders");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  >
                    <FiPackage size={15} />
                    Đơn hàng
                  </button>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    >
                      <FiShield size={15} />
                      Quản trị
                    </Link>
                  )}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut size={15} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/50 transition-all"
            >
              <FiUser size={15} />
              Đăng nhập
            </Link>
          )}

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <FiShoppingCart size={16} />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {cartItems.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce-in">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden items-center justify-center h-10 w-10 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-6 pb-3 lg:hidden">
        <SearchBar />
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white animate-fade-in-down">
          <div className="px-6 py-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">
              Danh mục
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    navigate(`/products/${category.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-orange-50 transition-colors"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-6 w-6 object-contain"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600"
              >
                <FiUser size={15} />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}

      {isCartOpen && <CartPopup />}
    </header>
  );
}

export default Header;
