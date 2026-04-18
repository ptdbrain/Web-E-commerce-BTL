import React from "react";
import { FiTruck, FiMapPin, FiUsers } from "react-icons/fi";

const fulfillmentOptions = [
  { value: "delivery", label: "Giao hàng", icon: FiTruck },
  { value: "pickup", label: "Tự đến lấy", icon: FiMapPin },
  { value: "dine_in", label: "Đặt bàn tại quán", icon: FiUsers },
];

export function CheckoutForm({ formData, setFormData }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <h3 className="font-display text-xl font-bold text-slate-900">
        Thông tin đặt món
      </h3>

      <div className="mt-6 space-y-5">
        {/* Fulfillment type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Hình thức nhận món
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            {fulfillmentOptions.map((option) => {
              const Icon = option.icon;
              const isActive = formData.fulfillmentType === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                    isActive
                      ? "border-orange-500 bg-orange-50 shadow-sm shadow-orange-500/10"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfillmentType"
                    value={option.value}
                    checked={isActive}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isActive ? "text-orange-700" : "text-slate-600"
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Name + Phone */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nguyen Van A"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="09xxxxxxxx"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
              required
            />
          </div>
        </div>

        {/* Delivery address */}
        {formData.fulfillmentType === "delivery" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              Địa chỉ giao hàng
            </label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              placeholder="Số nhà, đường, tòa nhà..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)] resize-none"
              required
            />
          </div>
        )}

        {/* Pickup time */}
        {formData.fulfillmentType === "pickup" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              Giờ đến lấy món
            </label>
            <input
              type="datetime-local"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
              required
            />
          </div>
        )}

        {/* Dine-in */}
        {formData.fulfillmentType === "dine_in" && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Giờ đặt bàn
                </label>
                <input
                  type="datetime-local"
                  name="bookingTime"
                  value={formData.bookingTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Số khách
                </label>
                <input
                  type="number"
                  min="1"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                Ghi chú đặt bàn
              </label>
              <textarea
                name="contactNote"
                rows="3"
                value={formData.contactNote}
                onChange={handleChange}
                placeholder="Sinh nhật, vị trí ngồi, trẻ em đi cùng..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)] resize-none"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
