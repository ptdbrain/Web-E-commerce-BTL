import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Tự động mở browser khi chạy npm run dev
    port: 5174, // Cố định port (tùy chọn)
  },
});
