import React, { useState, useEffect, useRef } from "react";
import {
  FiMenu,
  FiSearch,
  FiMapPin,
  FiUser,
  FiShoppingCart,
  FiChevronRight,
  FiChevronDown,
  FiShield,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { categories } from "../../../data/categories";
import { CartPopup } from "../../cart/CartPopup";
import { useCart } from "../../../hooks/useCart";
import SearchBar from "../SearchBar/SearchBar";

function Header() {
  const navigate = useNavigate();
  const [productOpen, setProductOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  });
  //const [showCartPopup, setShowCartPopup] = useState(false);
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();

  useEffect(() => {
    const storageHandler = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch (e) {
        setUser(null);
      }
    };

    const authHandler = () => {
      storageHandler();
    };

    window.addEventListener("storage", storageHandler);
    window.addEventListener("authChanged", authHandler);
    return () => {
      window.removeEventListener("storage", storageHandler);
      window.removeEventListener("authChanged", authHandler);
    };
  }, []);

  // keep axios default Authorization in sync with stored token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      else delete axios.defaults.headers.common["Authorization"];
    } catch (e) {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProductOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const brands = {
    laptop: ["Lenovo", "Dell", "Asus", "Acer", "Apple", "HP"],
    subcategories: [
      {
        name: "Dell",
        items: ["XPS", "Inspiron", "Precision", "Latitude", "Alienware"],
      },
      { name: "HP", items: ["Zbook", "Pavilion"] },
      { name: "Microsoft", items: ["Surface Pro", "Surface Laptop"] },
      { name: "Lenovo", items: ["ThinkPad", "Yoga", "ThinkBook"] },
      { name: "Acer", items: ["Lenovo", "Dell"] },
    ],
  };

  return (
    <header className="bg-sky-100 px-8 py-4 flex justify-between items-center border-b border-sky-200 font-sans z-10 relative">
      <div className="flex items-center gap-5">
         <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-3xl font-bold text-blue-500 relative pr-2.5"
        >
          Tech-Geeks
          <span className="w-1 h-6 bg-orange-500 rounded absolute right-0 top-1/2 -translate-y-1/2"></span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProductOpen(!productOpen)}
            className="flex items-center gap-2 text-gray-800 font-medium text-sm bg-white px-3 py-2 rounded-lg shadow-sm hover:text-blue-500"
          >
            <FiMenu />
            <span>Sản phẩm</span>
          </button>

          {productOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 w-[900px] p-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Cột 1: Danh mục sản phẩm */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    Gợi ý cho bạn
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {brands.laptop.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          navigate(`/products/laptop?brand=${brand}`);
                          setProductOpen(false);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-blue-500 hover:text-blue-500"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    {categories.slice(0, 10).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          navigate(`/products/${category.slug}`);
                          setProductOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cột 2 & 3: Thương hiệu và dòng sản phẩm */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                  {brands.subcategories.map((brand) => (
                    <div key={brand.name}>
                      <h4
                        onClick={() => {
                          navigate(`/products/laptop?brand=${brand.name}`);
                          setProductOpen(false);
                        }}
                        className="font-bold text-gray-800 mb-2 flex items-center gap-2 cursor-pointer hover:text-blue-500"
                      >
                        {brand.name}
                        <FiChevronRight className="text-gray-400" />
                      </h4>
                      <div className="space-y-1">
                        {brand.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              navigate(
                                `/products/laptop?brand=${brand.name}&model=${item}`
                              );
                              setProductOpen(false);
                            }}
                            className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-blue-500"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow mx-8 max-w-xl">
        <SearchBar />
      </div>

      {/* Icons & Giỏ hàng (Code theo logic mới của Team) */}
      <div className="flex items-center gap-5">
        <a
          href="https://maps.app.goo.gl/xoJgcG75CwWiaHd98"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-800 font-medium text-sm hover:text-blue-500"
     >
          <FiMapPin />
          <span>Địa chỉ cửa hàng</span>
        </a>
        {user ? (
          <div
            className="flex items-center gap-3 relative"
            ref={userDropdownRef}
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <FiUser />
              </div>
              {user?.fullname && (
                <span className="max-w-[150px] truncate text-sm font-medium text-gray-700">
                  {user.fullname}
                </span>
              )}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-gray-600 px-2 py-1 hover:bg-transparent"
                aria-label="Open user menu"
                style={{ background: "transparent", border: "none" }}
              >
                <FiChevronDown />
              </button>
            </div>
            {/*hiển thị nút bấm admin chỉ với tài khoản admin */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="ml-3 text-sm text-gray-700 hover:text-blue-600 flex items-center gap-1"
              >
                <FiShield />
                <span>Admin</span>
              </Link>
            )}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow p-2 w-40 z-50">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                >
                  Hồ sơ của tôi
                </button>

                {/* Nút chuyển sang trang đơn hàng */}
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/orders");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                >
                  Đơn hàng của tôi
                </button>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/vouchers");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                >
                  Voucher của tôi
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    // remove axios header
                    try {
                      delete axios.defaults.headers.common["Authorization"];
                    } catch (e) {}
                    // notify other listeners in same window
                    window.dispatchEvent(new Event("authChanged"));
                    setUser(null);
                    setUserMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-800 font-medium text-sm hover:text-blue-500"
          >
            <FiUser />
            <span>Đăng nhập</span>
          </Link>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-cyan-400 text-white rounded-full px-4 py-2.5 text-sm font-bold cursor-pointer hover:bg-cyan-500 relative"
          >
            <FiShoppingCart />
            <span>Giỏ hàng</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        {isCartOpen && <CartPopup />}
      </div>
    </header>
  );
}

export default Header;
