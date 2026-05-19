import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SEO from "../components/common/SEO";

export default function GoogleCompleteProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullname: state.fullname || "",
    phoneNumber: "",
    address: "",
  });
  const [email, setEmail] = useState(state.email || "");
  const [googleSignupToken, setGoogleSignupToken] = useState(
    state.googleSignupToken || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.email || !state.googleSignupToken) {
      navigate("/login", { replace: true });
    }
  }, [state, navigate]);

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

      const res = await axios.post(
        "https://it4409-deploy-backend.onrender.com/api/google/complete-profile",
        {
          googleSignupToken,
          username: form.username,
          password: form.password,
          confirmPassword: form.confirmPassword,
          fullname: form.fullname,
          phoneNumber: form.phoneNumber,
          address: form.address,
        }
      );

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

      setError(
        res.data.message ||
          "Hoàn tất hồ sơ với Google thành công nhưng không nhận được thông tin tài khoản."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Hoàn tất hồ sơ với Google thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SEO
        title="Hoàn tất hồ sơ Google"
        description="Hoàn tất thông tin tài khoản sau khi đăng nhập bằng Google."
      />
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Hoàn tất hồ sơ của bạn
        </h2>
        {email && (
          <p className="text-sm text-gray-600 mb-3">
            Đang sử dụng email: <strong>{email}</strong>
          </p>
        )}
        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="fullname"
            required
            placeholder="Họ và tên"
            value={form.fullname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="username"
            required
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="phoneNumber"
            required
            placeholder="Số điện thoại"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="address"
            required
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            disabled={loading}
            className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700"
          >
            {loading ? "Đang lưu..." : "Hoàn tất"}
          </button>
        </form>
      </div>
    </div>
  );
}
