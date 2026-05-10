import React, { useEffect, useState } from "react";
import axios from "axios";

const EMPTY_FORM = {
  code: "",
  description: "",
  discountType: "percent",
  discountValue: 0,
  maxDiscountAmount: 0,
  minOrderValue: 0,
  maxUsage: 0,
  startDate: "",
  endDate: "",
  appliesToAllUsers: true,
  appliesToAllProducts: true,
  userIds: [],
  productIds: [],
};

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  // editingId !== null => đang ở chế độ sửa
  const [editingId, setEditingId] = useState(null);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);

  const token = localStorage.getItem("token");

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("https://it4409-deploy-backend.onrender.com/api/vouchers", {
        headers: authHeaders,
      });
      setVouchers(res.data.vouchers || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Không thể tải danh sách voucher."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (
      name === "discountValue" ||
      name === "maxDiscountAmount" ||
      name === "minOrderValue" ||
      name === "maxUsage"
    ) {
      setForm((prev) => ({ ...prev, [name]: Number(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
      };

      const res = await axios.post(
        "https://it4409-deploy-backend.onrender.com/api/vouchers",
        payload,
        { headers: authHeaders }
      );

      setForm(EMPTY_FORM);
      setVouchers((prev) => [res.data.voucher, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Không thể tạo voucher. Vui lòng thử lại."
      );
    }
  };

  const handleEditVoucher = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form };
      const res = await axios.put(
        `https://it4409-deploy-backend.onrender.com/api/vouchers/${editingId}`,
        payload,
        { headers: authHeaders }
      );
      setVouchers((prev) =>
        prev.map((v) => (v._id === editingId ? res.data.voucher : v))
      );
      setEditingId(null);
      setForm(EMPTY_FORM);
      setShowCreateForm(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Không thể cập nhật voucher. Vui lòng thử lại."
      );
    }
  };

  const handleOpenEdit = (v) => {
    setEditingId(v._id);
    setForm({
      code: v.code || "",
      description: v.description || "",
      discountType: v.discountType || "percent",
      discountValue: v.discountValue || 0,
      maxDiscountAmount: v.maxDiscountAmount || 0,
      minOrderValue: v.minOrderValue || 0,
      maxUsage: v.maxUsage || 0,
      startDate: v.startDate ? v.startDate.slice(0, 10) : "",
      endDate: v.endDate ? v.endDate.slice(0, 10) : "",
      appliesToAllUsers: v.appliesToAllUsers ?? true,
      appliesToAllProducts: v.appliesToAllProducts ?? true,
      userIds: (v.users || []).map((u) => (typeof u === "object" ? u._id : u)),
      productIds: (v.products || []).map((p) => (typeof p === "object" ? p._id : p)),
    });
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleDeleteVoucher = async (id) => {
    if (!window.confirm("Xóa voucher này?")) return;
    try {
      await axios.delete(`https://it4409-deploy-backend.onrender.com/api/vouchers/${id}`, {
        headers: authHeaders,
      });
      setVouchers((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      alert(
        err?.response?.data?.message || "Không thể xóa voucher. Vui lòng thử lại."
      );
    }
  };

  const fetchUsers = async (search) => {
    try {
      setUserLoading(true);
      const res = await axios.get(
        "https://it4409-deploy-backend.onrender.com/api/vouchers/search-users",
        {
          params: search ? { q: search } : {},
          headers: authHeaders,
        }
      );
      setUserResults(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchProducts = async (search) => {
    try {
      setProductLoading(true);
      const res = await axios.get(
        "https://it4409-deploy-backend.onrender.com/api/vouchers/search-products",
        {
          params: search ? { q: search } : {},
          headers: authHeaders,
        }
      );
      setProductResults(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setProductLoading(false);
    }
  };


  useEffect(() => {
    if (!userModalOpen) return;
    const delayDebounce = setTimeout(() => {
      fetchUsers(userSearch);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [userSearch, userModalOpen]);

  useEffect(() => {
    if (!productModalOpen) return;
    const delayDebounce = setTimeout(() => {
      fetchProducts(productSearch);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [productSearch, productModalOpen]);

  const openUserModal = () => {
    setUserSearch("");
    setUserResults([]);
    setUserModalOpen(true);
    fetchUsers("");
  };

  const openProductModal = () => {
    setProductSearch("");
    setProductResults([]);
    setProductModalOpen(true);
    fetchProducts("");
  };

  const toggleUserSelection = (id) => {
    setForm((prev) => ({
      ...prev,
      appliesToAllUsers: false,
      userIds: prev.userIds.includes(id)
        ? prev.userIds.filter((uid) => uid !== id)
        : [...prev.userIds, id],
    }));
  };

  const toggleProductSelection = (id) => {
    setForm((prev) => ({
      ...prev,
      appliesToAllProducts: false,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((pid) => pid !== id)
        : [...prev.productIds, id],
    }));
  };

  const handleSelectAllUsers = () => {
    if (!userSearch.trim()) {
      setForm((prev) => ({
        ...prev,
        appliesToAllUsers: true,
        userIds: [],
      }));
    } else {
      const allIds = userResults.map((u) => u._id);
      setForm((prev) => ({
        ...prev,
        appliesToAllUsers: false,
        userIds: allIds,
      }));
    }
  };

  const handleSelectAllProducts = () => {
    if (!productSearch.trim()) {
      setForm((prev) => ({
        ...prev,
        appliesToAllProducts: true,
        productIds: [],
      }));
    } else {
      const allIds = productResults.map((p) => p._id);
      setForm((prev) => ({
        ...prev,
        appliesToAllProducts: false,
        productIds: allIds,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý voucher</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          {showCreateForm ? "Ẩn form tạo voucher" : "Tạo voucher mới"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Danh sách voucher</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Đang tải...</p>
          ) : vouchers.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có voucher nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Mã</th>
                    <th className="px-3 py-2 text-left">Mô tả</th>
                    <th className="px-3 py-2 text-left">Loại</th>
                    <th className="px-3 py-2 text-left">Giá trị</th>
                    <th className="px-3 py-2 text-left">Tối đa</th>
                    <th className="px-3 py-2 text-left">Đơn tối thiểu</th>
                    <th className="px-3 py-2 text-left">SL tối đa</th>
                    <th className="px-3 py-2 text-left">Đã dùng</th>
                    <th className="px-3 py-2 text-left">Trạng thái</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v._id} className="border-t">
                      <td className="px-3 py-2 font-semibold">{v.code}</td>
                      <td className="px-3 py-2 max-w-xs truncate">
                        {v.description || ""}
                      </td>
                      <td className="px-3 py-2">
                        {v.discountType === "percent" ? "Giảm %" : "Giảm tiền"}
                      </td>
                      <td className="px-3 py-2">
                        {v.discountType === "percent"
                          ? `${v.discountValue}%`
                          : `${v.discountValue?.toLocaleString("vi-VN")}đ`}
                      </td>
                      <td className="px-3 py-2">
                        {v.maxDiscountAmount
                          ? `${v.maxDiscountAmount.toLocaleString("vi-VN")}đ`
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {v.minOrderValue
                          ? `${v.minOrderValue.toLocaleString("vi-VN")}đ`
                          : "0đ"}
                      </td>
                      <td className="px-3 py-2">
                        {v.maxUsage && v.maxUsage > 0 ? v.maxUsage : "Không giới hạn"}
                      </td>
                      <td className="px-3 py-2">
                        {typeof v.usedCount === "number" ? v.usedCount : 0}
                      </td>
                      <td className="px-3 py-2">
                        {v.isActive ? (
                          <span className="text-green-600">Đang hoạt động</span>
                        ) : (
                          <span className="text-gray-500">Ngừng</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right flex gap-3 justify-end">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteVoucher(v._id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Form tạo voucher chuyển sang modal, không hiển thị trực tiếp bên phải */}
        {showCreateForm && (
          <></>
        )}
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editingId ? "Chỉnh sửa voucher" : "Tạo voucher mới"}
              </h2>
              <button
                type="button"
                onClick={handleCloseForm}
                className="text-sm text-gray-500 hover:underline"
              >
                Đóng
              </button>
            </div>
        <form
          onSubmit={editingId ? handleEditVoucher : handleCreateVoucher}
          className="space-y-4"
        >
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mã voucher</label>
            <input
              name="code"
              value={form.code}
              onChange={handleFormChange}
              required
              disabled={!!editingId}
              className={`w-full border rounded px-3 py-2 text-sm ${editingId ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
            />
            {editingId && <p className="text-xs text-gray-400 mt-1">Mã voucher không thể thay đổi sau khi tạo.</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Mô tả (tuỳ chọn)
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loại giảm giá</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="percent">Giảm theo %</option>
              <option value="amount">Giảm số tiền cố định</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Giá trị giảm
              {form.discountType === "percent" ? " (%)" : " (VND)"}
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="discountValue"
              value={form.discountValue}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {form.discountType === "percent" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Giảm tối đa (VND, cho %)
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="maxDiscountAmount"
                value={form.maxDiscountAmount}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Giá trị đơn hàng tối thiểu (VND)
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="minOrderValue"
              value={form.minOrderValue}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Số lượng sử dụng tối đa (0 = không giới hạn)
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="maxUsage"
              value={form.maxUsage}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center border-t pt-4 mt-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="appliesToAllUsers"
              checked={form.appliesToAllUsers}
              onChange={handleFormChange}
            />
            Áp dụng cho mọi người dùng
          </label>
          <button
            type="button"
            onClick={openUserModal}
            disabled={form.appliesToAllUsers}
            className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 ${
              form.appliesToAllUsers ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Chọn người dùng
          </button>
          {!form.appliesToAllUsers && form.userIds.length > 0 && (
            <span className="text-xs text-gray-600">
              Đã chọn {form.userIds.length} người dùng
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="appliesToAllProducts"
              checked={form.appliesToAllProducts}
              onChange={handleFormChange}
            />
            Áp dụng cho mọi sản phẩm
          </label>
          <button
            type="button"
            onClick={openProductModal}
            disabled={form.appliesToAllProducts}
            className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 ${
              form.appliesToAllProducts ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Chọn sản phẩm
          </button>
          {!form.appliesToAllProducts && form.productIds.length > 0 && (
            <span className="text-xs text-gray-600">
              Đã chọn {form.productIds.length} sản phẩm
            </span>
          )}
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCloseForm}
            className="px-4 py-2 border text-sm rounded hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            {editingId ? "Lưu thay đổi" : "Tạo voucher"}
          </button>
        </div>
        </form>
          </div>
        </div>
      )}

      {userModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Chọn người dùng</h3>
              <button
                onClick={() => setUserModalOpen(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Đóng
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm theo tên, username hoặc email"
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => fetchUsers(userSearch)}
                className="px-3 py-2 text-sm border rounded hover:bg-gray-100"
              >
                Tìm
              </button>
              <button
                type="button"
                onClick={handleSelectAllUsers}
                className="px-3 py-2 text-sm border rounded hover:bg-gray-100"
              >
                Chọn tất cả
              </button>
            </div>
            {userLoading ? (
              <p className="text-sm text-gray-500">Đang tải...</p>
            ) : (
              <div className="flex-1 max-h-[60vh] overflow-y-auto border rounded">
                {userResults.map((u) => (
                  <label
                    key={u._id}
                    className="flex items-center gap-2 px-3 py-2 border-b text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.userIds.includes(u._id) || form.appliesToAllUsers}
                      onChange={() => toggleUserSelection(u._id)}
                      disabled={form.appliesToAllUsers}
                    />
                    <span>
                      {u.fullname || u.username} ({u.email})
                    </span>
                  </label>
                ))}
                {userResults.length === 0 && (
                  <p className="text-sm text-gray-500 p-3">
                    Không có người dùng phù hợp.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {productModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Chọn sản phẩm</h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Đóng
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Tìm theo tên, thương hiệu hoặc danh mục"
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleSelectAllProducts}
                className="px-3 py-2 text-sm border rounded hover:bg-gray-100"
              >
                Chọn tất cả
              </button>
            </div>
            {productLoading ? (
              <p className="text-sm text-gray-500">Đang tải...</p>
            ) : (
              <div className="flex-1 max-h-[60vh] overflow-y-auto border rounded">
                {productResults.map((p) => (
                  <label
                    key={p._id}
                    className="flex items-center gap-2 px-3 py-2 border-b text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        form.productIds.includes(p._id) || form.appliesToAllProducts
                      }
                      onChange={() => toggleProductSelection(p._id)}
                      disabled={form.appliesToAllProducts}
                    />
                    <span>{p.name}</span>
                  </label>
                ))}
                {productResults.length === 0 && (
                  <p className="text-sm text-gray-500 p-3">
                    Không có sản phẩm phù hợp.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
