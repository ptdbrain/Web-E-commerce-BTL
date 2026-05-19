# Hướng dẫn Test Performance với Lighthouse

### 1. **SEO Meta Tags**

- Thêm title, description, Open Graph, Twitter Card cho mọi trang
- Canonical URL để tránh duplicate content
- noindex cho trang 404

### 2. **Image Lazy Loading**

- Component OptimizedImage với loading="lazy"
- Placeholder shimmer effect
- Error handling cho ảnh bị lỗi

### 3. **Code Splitting**

- React.lazy() cho tất cả pages
- Suspense với PageLoader
- Giảm initial bundle size

### 4. **Error Boundary**

- Bắt lỗi React để tránh white screen
- Hiển thị UI fallback thân thiện
- Log chi tiết ở development mode

### 5. **404 Page**

- Trang 404 đẹp với animation
- Nút về trang chủ và quay lại
- SEO với noindex

---

## Cách chạy Lighthouse Test

### **Bước 1: Mở DevTools**

1. Mở Chrome
2. Truy cập: http://localhost:5174/
3. Nhấn **F12** hoặc **Ctrl+Shift+I** (Windows) / **Cmd+Option+I** (Mac)

### **Bước 2: Chạy Lighthouse**

1. Click tab **Lighthouse** (hoặc "Performance insights")
2. Chọn các categories:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
3. Device: **Desktop** hoặc **Mobile**
4. Click **"Analyze page load"**

### **Bước 3: Xem kết quả**

Sau 30-60 giây, bạn sẽ thấy điểm số:

```
Performance:    [85-100]
Accessibility:  [80-100]
Best Practices: [80-100]
SEO:            [90-100]
```

---

## Các trang cần test

Test lần lượt các trang sau:

1. **Trang chủ**: `http://localhost:5174/`
2. **Danh sách sản phẩm**: `http://localhost:5174/products`
3. **Chi tiết sản phẩm**: `http://localhost:5174/product/1`
4. **404 Page**: `http://localhost:5174/invalid-url`

---

## Kiểm tra Code Splitting

### **Xem bundle chunks:**

1. Mở **DevTools** → Tab **Network**
2. Reload trang (Ctrl+R)
3. Lọc: **JS**
4. Tìm các file:
   - `index-[hash].js` (main bundle - nhỏ hơn trước)
   - `LoginPage-[hash].js` (lazy chunk)
   - `ProductListingPage-[hash].js` (lazy chunk)
   - `ProductDetailPage-[hash].js` (lazy chunk)

### **Test lazy loading:**

1. Ở trang chủ → chỉ load `index-[hash].js`
2. Click "Đăng nhập" → load thêm `LoginPage-[hash].js`
3. Click sản phẩm → load thêm `ProductDetailPage-[hash].js`

---
