import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import SEO from "../components/common/SEO";

const API_BASE_URL = "https://it4409-deploy-backend.onrender.com/api";

const fieldsConfig = [
  { key: "fullname", label: "Họ và tên" },
  { key: "email", label: "Email" },
  { key: "phoneNumber", label: "Số điện thoại" },
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
      const res = await axios.get(`${API_BASE_URL}/user/me`);
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
      await axios.put(`${API_BASE_URL}/user/me`, payload);
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
    <div className="min-h-screen bg-gray-50 flex justify-center py-8 px-4">
      <SEO
        title="Hồ sơ cá nhân"
        description="Xem và cập nhật thông tin tài khoản của bạn."
      />
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-bold mb-4 text-gray-800">Hồ sơ của tôi</h1>
        {user && (
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              {user.avatarPicture ? (
                <img
                  src={user.avatarPicture}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
                  {(user.fullname || user.username || "?")
                    .toString()
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-700 font-medium">
                {user.fullname || user.username}
              </div>
              <div className="text-xs text-gray-500">
                {user.email || "Email trống"}
              </div>
              <button
                type="button"
                onClick={() => {
                  setAvatarEditing(true);
                  setAvatarValue(user.avatarPicture || "");
                }}
                className="mt-2 text-xs px-3 py-1 border rounded text-gray-700 hover:bg-gray-50"
              >
                Sửa avatar
              </button>
            </div>
          </div>
        )}
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {loading ? (
          <div className="text-sm text-gray-500">Đang tải thông tin...</div>
        ) : !user ? (
          <div className="text-sm text-gray-500">Không tìm thấy thông tin người dùng.</div>
        ) : (
          <div className="space-y-3">
            {fieldsConfig.map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between border rounded-lg px-3 py-2"
              >
                <div>
                  <div className="text-xs text-gray-500">{f.label}</div>
                  {editingField === f.key ? (
                    <input
                      autoFocus
                      className="mt-1 text-sm border rounded px-2 py-1 w-full"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <div className="text-sm text-gray-800">
                      {renderValue(user[f.key])}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-shrink-0 flex items-center gap-2">
                  {editingField === f.key ? (
                    <>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="text-xs px-2 py-1 bg-sky-600 text-white rounded"
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-xs px-2 py-1 border rounded text-gray-600"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(f.key)}
                      className="p-2 text-gray-500 hover:text-sky-600"
                      aria-label={`Sửa ${f.label}`}
                    >
                      <FiEdit2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Địa chỉ */}
            <div className="flex items-center justify-between border rounded-lg px-3 py-2">
              <div>
                <div className="text-xs text-gray-500">Địa chỉ</div>
                {editingField === "address" ? (
                  <input
                    autoFocus
                    className="mt-1 text-sm border rounded px-2 py-1 w-full"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  <div className="text-sm text-gray-800">{addressValue}</div>
                )}
              </div>
              <div className="ml-3 flex-shrink-0 flex items-center gap-2">
                {editingField === "address" ? (
                  <>
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="text-xs px-2 py-1 bg-sky-600 text-white rounded"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-xs px-2 py-1 border rounded text-gray-600"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit("address")}
                    className="p-2 text-gray-500 hover:text-sky-600"
                    aria-label="Sửa địa chỉ"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setPasswordModalOpen(true);
                  setPasswordError("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-sm px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* sửa avatar: nhập URL ảnh */}
      {avatarEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Sửa avatar</h3>
            <p className="text-xs text-gray-500 mb-2">
              Nhập URL ảnh avatar (ví dụ ảnh đã upload lên Cloudinary).
            </p>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded mb-4 text-sm"
              placeholder="https://..."
              value={avatarValue}
              onChange={(e) => setAvatarValue(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAvatarEditing(false)}
                className="px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setError("");
                    await axios.put(`${API_BASE_URL}/user/me`, {
                      avatarPicture: avatarValue,
                    });
                    await loadProfile();
                    setAvatarEditing(false);
                  } catch (err) {
                    console.error("Failed to update avatar", err);
                    setError(err?.response?.data?.message || "Cập nhật avatar thất bại.");
                  }
                }}
                className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* đổi mật khẩu */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Đổi mật khẩu</h3>
            {passwordError && (
              <div className="mb-3 text-xs text-red-600">{passwordError}</div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPasswordError("");
                setPasswordLoading(true);
                try {
                  await axios.put(`${API_BASE_URL}/user/change-password`, {
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
              className="space-y-3"
            >
              <div>
                <div className="text-xs text-gray-600 mb-1">Mật khẩu hiện tại</div>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Mật khẩu mới</div>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Xác nhận mật khẩu mới</div>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-3 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
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
