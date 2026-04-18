import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock, FiMail, FiPhone, FiMapPin, FiArrowRight } from "react-icons/fi";
import SEO from "../components/common/SEO";
import { buildApiUrl } from "../config/api";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (form.password !== form.confirmPassword) {
        setError("Mật khẩu và xác nhận mật khẩu không khớp.");
        setLoading(false);
        return;
      }

      const res = await axios.post(buildApiUrl("/register"), {
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
        fullname: form.fullname,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
      });
      const user = res.data.user;
      const token = res.data.token;

      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
        return;
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "fullname", label: "Họ và tên", type: "text", icon: FiUser, placeholder: "Nguyen Van A" },
    { name: "email", label: "Email", type: "email", icon: FiMail, placeholder: "email@example.com" },
    { name: "username", label: "Tên đăng nhập", type: "text", icon: FiUser, placeholder: "username" },
    { name: "phoneNumber", label: "Số điện thoại", type: "tel", icon: FiPhone, placeholder: "09xxxxxxxx" },
    { name: "address", label: "Địa chỉ", type: "text", icon: FiMapPin, placeholder: "Số nhà, đường, quận..." },
    { name: "password", label: "Mật khẩu", type: "password", icon: FiLock, placeholder: "Mật khẩu" },
    { name: "confirmPassword", label: "Xác nhận mật khẩu", type: "password", icon: FiLock, placeholder: "Nhập lại mật khẩu" },
  ];

  return (
    <div className="flex min-h-screen">
      <SEO
        title="Đăng ký tài khoản"
        description="Tạo tài khoản FireBite để nhận ưu đãi và theo dõi đơn hàng."
      />

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-12 relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-600/20 blur-[80px]" />
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6">🍟</div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Tạo tài khoản
            <br />
            <span className="text-orange-100">nhận ưu đãi ngay</span>
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-sm mx-auto">
            Đăng ký để đặt món, tích điểm và nhận voucher riêng.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-6">
            <span className="font-display text-3xl font-bold text-gradient">Fire</span>
            <span className="font-display text-3xl font-bold text-slate-800">Bite</span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Đăng ký
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Điền thông tin để tạo tài khoản mới
            </p>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              {fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name}>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Icon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={15}
                      />
                      <input
                        name={field.name}
                        type={field.type}
                        required
                        placeholder={field.placeholder}
                        value={form[field.name]}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Đăng ký
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-400">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
