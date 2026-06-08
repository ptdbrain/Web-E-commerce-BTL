import React from "react";
import {
  FiCheck,
  FiMapPin,
  FiTruck,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const fulfillmentOptions = [
  { value: "delivery", label: "Giao hàng", icon: FiTruck },
  { value: "pickup", label: "Tự đến lấy", icon: FiMapPin },
  { value: "dine_in", label: "Đặt bàn tại quán", icon: FiUsers },
];

const contactOptions = [
  {
    value: "account",
    label: "Thông tin tài khoản",
    description: "Dùng thông tin đã lưu",
    icon: FiUser,
  },
  {
    value: "custom",
    label: "Đặt hộ / địa chỉ khác",
    description: "Chỉ áp dụng cho đơn này",
    icon: FiMapPin,
  },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]";

export function CheckoutForm({
  formData,
  setFormData,
  contactMode,
  onContactModeChange,
  accountContact,
  profileLoading,
  profileError,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <h3 className="font-display text-xl font-bold text-slate-900">
        Thông tin đặt món
      </h3>

      <div className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Hình thức nhận món
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            {fulfillmentOptions.map((option) => {
              const Icon = option.icon;
              const active = formData.fulfillmentType === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                    active
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfillmentType"
                    value={option.value}
                    checked={active}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-slate-600">
            Thông tin người nhận
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {contactOptions.map((option) => {
              const Icon = option.icon;
              const active = contactMode === option.value;
              const disabled = option.value === "account" && !accountContact;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled || profileLoading}
                  onClick={() => onContactModeChange(option.value)}
                  className={`flex min-h-[74px] items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors ${
                    active
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 hover:border-slate-300"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                      {option.label}
                      {active && <FiCheck size={14} className="text-orange-600" />}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {profileLoading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            Đang tải thông tin tài khoản...
          </div>
        )}

        {profileError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {profileError}
          </div>
        )}

        {!profileLoading && contactMode === "account" && accountContact && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <FiCheck size={16} />
              Sử dụng thông tin đã lưu
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Người nhận</dt>
                <dd className="mt-1 break-words font-medium text-slate-800">
                  {accountContact.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Số điện thoại</dt>
                <dd className="mt-1 font-medium text-slate-800">
                  {accountContact.phone}
                </dd>
              </div>
              {formData.fulfillmentType === "delivery" && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">Địa chỉ giao hàng</dt>
                  <dd className="mt-1 break-words font-medium text-slate-800">
                    {accountContact.address}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {!profileLoading && contactMode === "custom" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600">
                  Họ và tên người nhận
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className={inputClass}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600">
                  Số điện thoại người nhận
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09xxxxxxxx"
                  className={inputClass}
                  required
                />
              </label>
            </div>
            {formData.fulfillmentType === "delivery" && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600">
                  Địa chỉ giao hàng
                </span>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Số nhà, đường, tòa nhà..."
                  className={`${inputClass} resize-none`}
                  required
                />
              </label>
            )}
          </div>
        )}

        {formData.fulfillmentType === "pickup" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">
              Giờ đến lấy món
            </span>
            <input
              type="datetime-local"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </label>
        )}

        {formData.fulfillmentType === "dine_in" && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600">
                  Giờ đặt bàn
                </span>
                <input
                  type="datetime-local"
                  name="bookingTime"
                  value={formData.bookingTime}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600">
                  Số khách
                </span>
                <input
                  type="number"
                  min="1"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600">
                Ghi chú đặt bàn
              </span>
              <textarea
                name="contactNote"
                rows="3"
                value={formData.contactNote}
                onChange={handleChange}
                placeholder="Sinh nhật, vị trí ngồi, trẻ em đi cùng..."
                className={`${inputClass} resize-none`}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
