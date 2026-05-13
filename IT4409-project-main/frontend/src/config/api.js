// Đọc base URL từ biến môi trường Vite, fallback về localhost khi dev
const viteApiBaseUrl =
  typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_BASE_URL : "";

export const API_BASE_URL = viteApiBaseUrl || "http://localhost:5000/api";

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
