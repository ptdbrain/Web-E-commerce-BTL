import React, { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// ===== EAGER IMPORTS (Components luôn cần) =====
import Header from "./components/common/Header/Header";
import Footer from "./components/home/WelcomeBanner/Footer";
import TechNews from "./components/home/WelcomeBanner/TechNews";
import PageLoader from "./components/common/PageLoader";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { CartPopup } from "./components/cart/CartPopup";
import ChatWidget from "./components/common/ChatWidget";

// ===== LAZY IMPORTS (Pages - chỉ load khi cần) =====
// Home components
const WelcomeBanner = lazy(() =>
  import("./components/home/WelcomeBanner/WelcomeBanner")
);
const CategoryList = lazy(() =>
  import("./components/home/CategoryList/CategoryList")
);
const FeaturedProductsSlider = lazy(() =>
  import("./components/home/WelcomeBanner/FeatureProduct")
);
const BestSellerProducts = lazy(() =>
  import("./components/home/BestSellerProducts")
);

// Pages
const TestProductCard = lazy(() => import("./pages/TestProductCard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const GoogleCompleteProfilePage = lazy(() =>
  import("./pages/GoogleCompleteProfilePage")
);
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ProductListingPage = lazy(() =>
  import("./pages/ProductListingPage/ProductListingPage")
);
const OrderPage = lazy(() => import("./pages/OrderPage"));
const ProductDetailPage = lazy(() =>
  import("./pages/ProductDetail").then((module) => ({
    default: module.ProductDetailPage,
  }))
);
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const [selectedCategory, setSelectedCategory] = useState("combo");

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 font-sans relative">
        <Header />

        {/* Wrap Routes với Suspense để lazy load pages */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <WelcomeBanner />
                  <CategoryList
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                  <FeaturedProductsSlider />
                  <BestSellerProducts />
                  <TechNews />
                </>
              }
            />

            <Route path="/test-card" element={<TestProductCard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/google-complete-profile"
              element={<GoogleCompleteProfilePage />}
            />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/products" element={<ProductListingPage />} />
            <Route
              path="/products/:category"
              element={<ProductListingPage />}
            />

            <Route path="/product/:id" element={<ProductDetailPage />} />

            <Route path="/orders" element={<OrderPage />} />

            {/* 404 Page - Phải đặt cuối cùng */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        <Footer />
        <CartPopup />
        <ChatWidget />
      </div>
    </ErrorBoundary>
  );
}

export default App;
