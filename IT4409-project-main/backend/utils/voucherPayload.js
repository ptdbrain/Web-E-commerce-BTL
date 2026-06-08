import { EVoucherDiscountType } from "../models/Voucher.js";

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return fallback;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseIdList = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => String(item).trim())
    .filter(Boolean);

const hasOwn = (payload, field) => Object.prototype.hasOwnProperty.call(payload, field);

const parseOptionalDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "invalid" : date;
};

export const normalizeVoucherPayload = (payload = {}, { partial = false } = {}) => {
  const normalized = {};

  if (!partial || hasOwn(payload, "code")) {
    normalized.code = String(payload.code || "").trim().toUpperCase();
  }

  if (!partial || hasOwn(payload, "description")) {
    normalized.description =
      typeof payload.description === "string" ? payload.description.trim() : "";
  }

  for (const field of ["discountType"]) {
    if (!partial || hasOwn(payload, field)) {
      normalized[field] = payload[field];
    }
  }

  for (const field of [
    "discountValue",
    "maxDiscountAmount",
    "minOrderValue",
    "maxUsage",
  ]) {
    if (!partial || hasOwn(payload, field)) {
      normalized[field] = toNumber(payload[field], 0);
    }
  }

  if (!partial || hasOwn(payload, "isActive")) {
    normalized.isActive =
      payload.isActive === undefined ? true : normalizeBoolean(payload.isActive, true);
  }

  const productIds = parseIdList(payload.productIds);
  const categoryIds = parseIdList(payload.categoryIds);
  const userIds = parseIdList(payload.userIds);

  if (!partial || hasOwn(payload, "appliesToAllProducts")) {
    normalized.appliesToAllProducts =
      payload.appliesToAllProducts === undefined
        ? productIds.length === 0 && categoryIds.length === 0
        : normalizeBoolean(payload.appliesToAllProducts, false);
  }

  if (!partial || hasOwn(payload, "appliesToAllUsers")) {
    normalized.appliesToAllUsers =
      payload.appliesToAllUsers === undefined
        ? userIds.length === 0
        : normalizeBoolean(payload.appliesToAllUsers, false);
  }

  if (!partial || hasOwn(payload, "userIds")) normalized.users = userIds;
  if (!partial || hasOwn(payload, "productIds")) normalized.products = productIds;
  if (!partial || hasOwn(payload, "categoryIds")) normalized.categories = categoryIds;

  if (!partial || hasOwn(payload, "startDate")) {
    normalized.startDate = parseOptionalDate(payload.startDate);
  }
  if (!partial || hasOwn(payload, "endDate")) {
    normalized.endDate = parseOptionalDate(payload.endDate);
  }

  return normalized;
};

export const validateVoucherPayload = (payload = {}, { partial = false } = {}) => {
  if (!partial && !payload.code) {
    return { message: "Thieu ma voucher hoac loai giam gia." };
  }

  if (!partial && !payload.discountType) {
    return { message: "Thieu ma voucher hoac loai giam gia." };
  }

  if (
    payload.discountType &&
    !Object.values(EVoucherDiscountType).includes(payload.discountType)
  ) {
    return { message: "Loại giảm giá không hợp lệ." };
  }

  if (
    payload.startDate === "invalid" ||
    payload.endDate === "invalid"
  ) {
    return { message: "Ngày hiệu lực voucher không hợp lệ." };
  }

  if (payload.startDate && payload.endDate && payload.startDate > payload.endDate) {
    return { message: "Ngày bắt đầu không được sau ngày kết thúc." };
  }

  if (payload.discountType === EVoucherDiscountType.Percent) {
    if (payload.discountValue <= 0 || payload.discountValue > 100) {
      return {
        message: "Phần trăm giảm giá phải lớn hơn 0 và không vượt quá 100.",
      };
    }
  }

  if (payload.discountType === EVoucherDiscountType.Amount) {
    if (payload.discountValue <= 0) {
      return { message: "Giá trị giảm giá phải lớn hơn 0." };
    }
  }

  if (payload.discountType === EVoucherDiscountType.FreeShipping) {
    payload.discountValue = 0;
    payload.maxDiscountAmount = 0;
  }

  return null;
};
