import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email"); // 'email' -> 'code'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email) {
        setError("Vui lòng nhập email.");
        setLoading(false);
        return;
      }

      const res = await axios.post("https://it4409-deploy-backend.onrender.com/api/forgot-password", {
        email,
      });

      setSuccess(res.data.message || "Nếu email tồn tại, mã xác thực đã được gửi.");
      setStep("code");
    } catch (err) {
      setError(err?.response?.data?.message || "Không gửi được yêu cầu đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email || !code || !newPassword || !confirmPassword) {
        setError("Vui lòng nhập đầy đủ thông tin.");
        setLoading(false);
        return;
      }

      const res = await axios.post("https://it4409-deploy-backend.onrender.com/api/reset-password", {
        email,
        code,
        newPassword,
        confirmPassword,
      });

      setSuccess(res.data.message || "Đặt lại mật khẩu thành công.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SEO
        title="Quên mật khẩu"
        description="Yêu cầu mã và đặt lại mật khẩu tài khoản của bạn."
      />
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Quên mật khẩu</h2>
        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
        {success && <div className="text-green-600 mb-3 text-sm">{success}</div>}

        {step === "email" ? (
          <form onSubmit={handleRequest} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Nhập email đã đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              disabled={loading}
              className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700"
            >
              {loading ? "Đang gửi mã..." : "Gửi mã xác thực"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              required
              maxLength={8}
              placeholder="Mã xác thực 8 ký tự"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border rounded tracking-[0.3em] text-center"
            />
            <input
              type="password"
              required
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="password"
              required
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              disabled={loading}
              className="w-full bg-sky-600 text-white py-2 rounded-lg font-medium hover:bg-sky-700"
            >
              {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
