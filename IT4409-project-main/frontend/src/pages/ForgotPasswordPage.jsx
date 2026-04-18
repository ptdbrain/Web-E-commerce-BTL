import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiKey, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import SEO from "../components/common/SEO";
import { buildApiUrl } from "../config/api";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email");
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

      const res = await axios.post(buildApiUrl("/forgot-password"), {
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

      const res = await axios.post(buildApiUrl("/reset-password"), {
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50/30 p-4">
      <SEO
        title="Quên mật khẩu"
        description="Yêu cầu mã và đặt lại mật khẩu tài khoản của bạn."
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/">
            <span className="font-display text-3xl font-bold text-gradient">Fire</span>
            <span className="font-display text-3xl font-bold text-slate-800">Bite</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
          {/* Step indicator */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === "email" ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white" : "bg-emerald-100 text-emerald-600"}`}>
              {step === "email" ? "1" : "✓"}
            </div>
            <div className="h-0.5 w-10 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full bg-orange-500 transition-all duration-500 ${step === "code" ? "w-full" : "w-0"}`} />
            </div>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === "code" ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white" : "bg-slate-100 text-slate-400"}`}>
              2
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-slate-900 text-center">
            {step === "email" ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
          </h2>
          <p className="mt-1 text-sm text-slate-400 text-center">
            {step === "email"
              ? "Nhập email để nhận mã xác thực"
              : "Nhập mã và mật khẩu mới"}
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-600">
              {success}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleRequest} className="mt-6 space-y-4">
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  placeholder="Nhập email đã đăng ký"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all disabled:opacity-60"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Gửi mã xác thực
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="mt-6 space-y-3.5">
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  required
                  maxLength={8}
                  placeholder="Mã xác thực 8 ký tự"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className={`${inputClass} tracking-[0.25em] text-center font-mono`}
                />
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all disabled:opacity-60"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Đặt lại mật khẩu
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-sm text-slate-400">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              <FiArrowLeft size={14} />
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
