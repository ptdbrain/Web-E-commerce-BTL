import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO";

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

      const res = await axios.post("http://localhost:5000/api/register", {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SEO
        title="Đăng ký tài khoản"
        description="Tạo tài khoản Tech-Geeks để nhận ưu đãi và theo dõi đơn hàng."
      />
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Đăng ký</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
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
            name="email"
            type="email"
            required
            placeholder="Email"
            value={form.email}
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
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}
