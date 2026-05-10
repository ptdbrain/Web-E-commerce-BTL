import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SEO from "../components/common/SEO";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email") || "";
    setEmail(emailParam);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email || !code) {
        setError("Vui lòng nhập đầy đủ email và mã xác thực.");
        setLoading(false);
        return;
      }

      const res = await axios.post("https://it4409-deploy-backend.onrender.com/api/verify-email", {
        email,
        code,
      });

      const user = res.data.user;
      const token = res.data.token;
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        window.dispatchEvent(new Event("authChanged"));
        setSuccess("Xác thực email thành công. Đang chuyển hướng...");
        setTimeout(() => navigate("/"), 1000);
        return;
      }

      setSuccess(res.data.message || "Xác thực thành công.");
    } catch (err) {
      setError(err?.response?.data?.message || "Xác thực email thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SEO
        title="Xác thực email"
        description="Nhập mã xác thực được gửi tới email của bạn."
      />
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Xác thực email</h2>
        {email && (
          <p className="text-sm text-gray-600 mb-2">
            Chúng tôi đã gửi mã xác thực 8 ký tự tới: <strong>{email}</strong>
          </p>
        )}
        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 mb-3 text-sm">{success}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          {!email && (
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          )}
          <input
            type="text"
            required
            maxLength={8}
            placeholder="Mã xác thực 8 ký tự"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border rounded tracking-[0.3em] text-center"
          />
          <button
            disabled={loading}
            className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700"
          >
            {loading ? "Đang xác thực..." : "Xác nhận"}
          </button>
        </form>
      </div>
    </div>
  );
}
