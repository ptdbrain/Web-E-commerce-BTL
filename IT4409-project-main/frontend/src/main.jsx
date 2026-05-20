import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ToastProvider } from "./contexts/ToastContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import "./index.css";

import App from "./App.jsx";
import AdminPortal from "./AdminPortal.jsx";
import AdminRouteGuard from "./components/admin/AdminRouteGuard.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";

// Tạo QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 phút
      cacheTime: 300000, // 5 phút
      refetchOnWindowFocus: false,
    },
  },
});

const syncAxiosAuthHeader = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  } catch {
    delete axios.defaults.headers.common.Authorization;
  }
};

syncAxiosAuthHeader();
window.addEventListener("authChanged", syncAxiosAuthHeader);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <CartProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/admin/*"
                    element={
                      <AdminRouteGuard>
                        <AdminPortal />
                      </AdminRouteGuard>
                    }
                  />
                  <Route path="/*" element={<App />} />
                </Routes>
              </BrowserRouter>
            </GoogleOAuthProvider>
          </CartProvider>
        </ToastProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
