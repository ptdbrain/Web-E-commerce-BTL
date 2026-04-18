import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import SEO from "../components/common/SEO";
import { buildApiUrl } from "../config/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(buildApiUrl("/login"), {
        username,
        password,
      });
      const user = res.data.user;
      const token = res.data.token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      window.dispatchEvent(new Event("authChanged"));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SEO
        title="Đăng nhập"
        description="Đăng nhập vào tài khoản FireBite để đặt món và nhận ưu đãi."
      />

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-orange-500 via-rose-500 to-orange-600 p-12 relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-rose-600/20 blur-[80px]" />
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6">🍔</div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Chào mừng trở lại
            <br />
            <span className="text-orange-100">FireBite</span>
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-sm mx-auto">
            Đăng nhập để đặt món, theo dõi đơn hàng và nhận ưu đãi riêng.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="font-display text-3xl font-bold text-gradient">Fire</span>
            <span className="font-display text-3xl font-bold text-slate-800">Bite</span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Đăng nhập
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Nhập thông tin tài khoản của bạn
            </p>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                    placeholder="Tên đăng nhập"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Mật khẩu
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                    placeholder="Mật khẩu"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Đăng nhập
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Quên mật khẩu?
              </button>
              <div className="text-slate-400">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
