import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiCamera, FiLock, FiX, FiCheck, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import SEO from "../components/common/SEO";
import { buildApiUrl } from "../config/api";

const fieldsConfig = [
  { key: "fullname", label: "Họ và tên", icon: FiUser },
  { key: "email", label: "Email", icon: FiMail },
  { key: "phoneNumber", label: "Số điện thoại", icon: FiPhone },
];

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [avatarEditing, setAvatarEditing] = useState(false);
  const [avatarValue, setAvatarValue] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const navigate = useNavigate();

  const getAddressFromUser = (u) => {
    if (!u) return "";
    if (Array.isArray(u.addresses) && u.addresses.length > 0) return u.addresses[0];
    return "";
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(buildApiUrl("/user/me"));
      setUser(res.data?.user || null);
    } catch (err) {
      console.error("Failed to load user profile", err);
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 401 && (message === "Invalid or expired token" || message === "No token provided")) {
        try {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          window.dispatchEvent(new Event("authChanged"));
        } catch (e) {}
        setError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        setError(message || "Không tải được thông tin hồ sơ.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const startEdit = (fieldKey) => {
    let currentValue = "";
    if (fieldKey === "address") {
      currentValue = getAddressFromUser(user);
    } else {
      currentValue = user?.[fieldKey] || "";
    }
    setEditingField(fieldKey);
    setEditValue(currentValue);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editingField) return;
    try {
      setError("");
      const payload = {};
      if (editingField === "address") {
        payload.address = editValue;
      } else {
        payload[editingField] = editValue;
      }
      await axios.put(buildApiUrl("/user/me"), payload);
      await loadProfile();
      cancelEdit();
    } catch (err) {
      console.error("Failed to update user profile", err);
      setError(err?.response?.data?.message || "Cập nhật thông tin thất bại.");
    }
  };

  const renderValue = (value) => {
    const v = (value ?? "").toString().trim();
    return v.length ? v : "trống";
  };

  const addressValue = renderValue(getAddressFromUser(user));

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 to-slate-50 py-10 px-4">
      <SEO
        title="Hồ sơ cá nhân"
        description="Xem và cập nhật thông tin tài khoản của bạn."
      />

      <div className="mx-auto max-w-xl">
        {/* Profile card */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card overflow-hidden">
          {/* Header gradient */}
          <div className="h-28 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-400 relative">
            <div className="absolute -bottom-10 left-6">
              <div className="relative">
                {user?.avatarPicture ? (
                  <img
                    src={user.avatarPicture}
                    alt="Avatar"
                    className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-orange-400 to-rose-500 text-2xl font-bold text-white shadow-lg">
                    {(user?.fullname || user?.username || "?")
                      .toString()
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <button
                  onClick={() => {
                    setAvatarEditing(true);
                    setAvatarValue(user?.avatarPicture || "");
                  }}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-500 shadow-md hover:text-orange-600 transition-colors"
                >
                  <FiCamera size={13} />
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 pt-14 pb-6">
            <h1 className="font-display text-xl font-bold text-slate-900">
              {user?.fullname || user?.username || "Đang tải..."}
            </h1>
            <p className="text-sm text-slate-400">
              {user?.email || ""}
            </p>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {loading ? (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl skeleton" />
                ))}
              </div>
            ) : !user ? (
              <div className="mt-6 text-sm text-slate-400">
                Không tìm thấy thông tin người dùng.
              </div>
            ) : (
              <div className="mt-6 space-y-2.5">
                {fieldsConfig.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.key}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                            {f.label}
                          </div>
                          {editingField === f.key ? (
                            <input
                              autoFocus
                              className="mt-0.5 w-full rounded-lg border border-orange-300 bg-white px-2 py-1 text-sm text-slate-800 outline-none focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                          ) : (
                            <div className="text-sm font-medium text-slate-800 truncate">
                              {renderValue(user[f.key])}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 shrink-0 flex items-center gap-1.5">
                        {editingField === f.key ? (
                          <>
                            <button
                              type="button"
                              onClick={saveEdit}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-glow transition-shadow"
                            >
                              <FiCheck size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors"
                            >
                              <FiX size={14} />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(f.key)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <FiEdit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Address field */}
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-colors hover:bg-slate-50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                      <FiMapPin size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Địa chỉ
                      </div>
                      {editingField === "address" ? (
                        <input
                          autoFocus
                          className="mt-0.5 w-full rounded-lg border border-orange-300 bg-white px-2 py-1 text-sm text-slate-800 outline-none focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      ) : (
                        <div className="text-sm font-medium text-slate-800 truncate">
                          {addressValue}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-3 shrink-0 flex items-center gap-1.5">
                    {editingField === "address" ? (
                      <>
                        <button type="button" onClick={saveEdit} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-glow transition-shadow">
                          <FiCheck size={14} />
                        </button>
                        <button type="button" onClick={cancelEdit} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors">
                          <FiX size={14} />
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => startEdit("address")} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Change password */}
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalOpen(true);
                    setPasswordError("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-orange-200 hover:text-orange-600 transition-all"
                >
                  <FiLock size={15} />
                  Đổi mật khẩu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar modal */}
      {avatarEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-scale-in">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Sửa avatar
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Nhập URL ảnh avatar (ví dụ ảnh đã upload lên Cloudinary).
            </p>
            <input
              type="text"
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
              placeholder="https://..."
              value={avatarValue}
              onChange={(e) => setAvatarValue(e.target.value)}
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAvatarEditing(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setError("");
                    await axios.put(buildApiUrl("/user/me"), {
                      avatarPicture: avatarValue,
                    });
                    await loadProfile();
                    setAvatarEditing(false);
                  } catch (err) {
                    console.error("Failed to update avatar", err);
                    setError(err?.response?.data?.message || "Cập nhật avatar thất bại.");
                  }
                }}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-shadow"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change password modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-scale-in">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Đổi mật khẩu
            </h3>
            {passwordError && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
                {passwordError}
              </div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPasswordError("");
                setPasswordLoading(true);
                try {
                  await axios.put(buildApiUrl("/user/change-password"), {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                  });
                  setPasswordLoading(false);
                  setPasswordModalOpen(false);
                } catch (err) {
                  setPasswordLoading(false);
                  setPasswordError(
                    err?.response?.data?.message || "Đổi mật khẩu thất bại."
                  );
                }
              }}
              className="mt-4 space-y-3"
            >
              {[
                { label: "Mật khẩu hiện tại", value: currentPassword, setter: setCurrentPassword },
                { label: "Mật khẩu mới", value: newPassword, setter: setNewPassword },
                { label: "Xác nhận mật khẩu mới", value: confirmPassword, setter: setConfirmPassword },
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    {field.label}
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-60"
                >
                  {passwordLoading ? "Đang đổi..." : "Lưu mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
