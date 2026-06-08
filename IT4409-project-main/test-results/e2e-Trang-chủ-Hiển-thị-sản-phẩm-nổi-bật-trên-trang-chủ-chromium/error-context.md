# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> Trang chủ >> Hiển thị sản phẩm nổi bật trên trang chủ
- Location: tests/e2e.spec.js:35:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[class*=\'product\'], [class*=\'Product\']').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[class*=\'product\'], [class*=\'Product\']').first()

```

```yaml
- banner:
  - img
  - text: 09:00 - 22:30 mỗi ngày
  - img
  - text: 256 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội
  - button "Fire Bite"
  - button "Thực đơn":
    - img
    - text: Thực đơn
    - img
  - img
  - textbox "Tìm kiếm":
    - /placeholder: Tìm sản phẩm...
  - img
  - text: Enter 1900 6868 Giao hàng • Pickup
  - link "Đăng nhập":
    - /url: /login
    - img
    - text: Đăng nhập
  - button "Giỏ hàng":
    - img
    - text: Giỏ hàng
- text: 🔥 Fast Food Store
- heading "FireBite giao nóng hổi, đặt món theo đúng cách bạn muốn." [level=1]
- paragraph: Burger, gà rán, combo nhóm — pickup trong 20 phút và đặt bàn ngay trong một lượt checkout.
- link "Xem combo hot":
  - /url: /products/combo
- link "Order gà rán":
  - /url: /products/fried-chicken
- text: 🔥 Món hot hôm nay 12 item bestseller 📦 Nhận món Delivery, pickup, dine-in ⏱️ Thời gian chuẩn bị 10 — 22 phút 🎟️ Voucher Giữ nguyên lượng hiện có
- paragraph: Chọn nhanh theo nhu cầu
- heading "Thực đơn nổi bật" [level=2]
- link "Xem toàn bộ menu →":
  - /url: /products
- link "Burger Burger Mở danh mục →":
  - /url: /products/burger
  - img "Burger"
  - text: Burger Mở danh mục →
- link "Gà rán Gà rán Mở danh mục →":
  - /url: /products/fried-chicken
  - img "Gà rán"
  - text: Gà rán Mở danh mục →
- link "Cơm và tô Cơm và tô Mở danh mục →":
  - /url: /products/rice-bowls
  - img "Cơm và tô"
  - text: Cơm và tô Mở danh mục →
- link "Mì ý và wrap Mì ý và wrap Mở danh mục →":
  - /url: /products/pasta-wraps
  - img "Mì ý và wrap"
  - text: Mì ý và wrap Mở danh mục →
- link "Món ăn nhanh Món ăn nhanh Mở danh mục →":
  - /url: /products/sides-snacks
  - img "Món ăn nhanh"
  - text: Món ăn nhanh Mở danh mục →
- link "Súp và salad Súp và salad Mở danh mục →":
  - /url: /products/soups-salads
  - img "Súp và salad"
  - text: Súp và salad Mở danh mục →
- link "Tráng miệng Tráng miệng Mở danh mục →":
  - /url: /products/desserts
  - img "Tráng miệng"
  - text: Tráng miệng Mở danh mục →
- link "Đồ uống Đồ uống Mở danh mục →":
  - /url: /products/drinks
  - img "Đồ uống"
  - text: Đồ uống Mở danh mục →
- link "Combo tiết kiệm Combo tiết kiệm Mở danh mục →":
  - /url: /products/combo
  - img "Combo tiết kiệm"
  - text: Combo tiết kiệm Mở danh mục →
- link "Ăn tối nhóm Ăn tối nhóm Mở danh mục →":
  - /url: /products/group-meals
  - img "Ăn tối nhóm"
  - text: Ăn tối nhóm Mở danh mục →
- link "Deal bữa trưa Deal bữa trưa Mở danh mục →":
  - /url: /products/lunch-deals
  - img "Deal bữa trưa"
  - text: Deal bữa trưa Mở danh mục →
- link "Combo FireBite 2 Người":
  - /url: /product/64f100000000000000000001
  - img "Combo FireBite 2 Người"
- paragraph: ✨ Featured combo
- link "Combo FireBite 2 Người":
  - /url: /product/64f100000000000000000001
  - heading "Combo FireBite 2 Người" [level=3]
- paragraph: 2 burger gà giòn, 1 khoai lắc phô mai lớn, 2 ly nước và 2 loại sốt signature.
- text: 2 burger gà giòn 1 khoai lắc phô mai L 2 pepsi 139.000đ 159.000đ
- link "Xem chi tiết →":
  - /url: /product/64f100000000000000000001
- link "Burger Double Beef Smokehouse":
  - /url: /product/64f100000000000000000033
  - img "Burger Double Beef Smokehouse"
- paragraph: ✨ Featured combo
- link "Burger Double Beef Smokehouse":
  - /url: /product/64f100000000000000000033
  - heading "Burger Double Beef Smokehouse" [level=3]
- paragraph: Hai lớp bò nướng, phô mai cheddar, hành giòn và sốt smokehouse.
- text: 99.000đ 109.000đ
- link "Xem chi tiết →":
  - /url: /product/64f100000000000000000033
- paragraph: 🔥 Bán chạy trong ngày
- heading "Món đang được order nhiều" [level=2]
- link "Xem toàn bộ →":
  - /url: /products
- article:
  - button "Gà Rán 3 Miếng Sốt Cajun -10%":
    - img "Gà Rán 3 Miếng Sốt Cajun"
    - text: "-10%"
  - text: spicy crispy
  - button "Gà Rán 3 Miếng Sốt Cajun"
  - text: 17 phút • Gà rán 89.000đ 99.000đ
  - button "Thêm vào giỏ":
    - img
- article:
  - button "Combo FireBite 2 Người -13%":
    - img "Combo FireBite 2 Người"
    - text: "-13%"
  - text: best seller group meal
  - button "Combo FireBite 2 Người"
  - text: 18 phút • Combo tiết kiệm 139.000đ 159.000đ
  - button "Thêm vào giỏ":
    - img
- article:
  - button "Burger Bò Phô Mai Tiêu Đen -11%":
    - img "Burger Bò Phô Mai Tiêu Đen"
    - text: "-11%"
  - text: chef pick
  - button "Burger Bò Phô Mai Tiêu Đen"
  - text: 15 phút • Burger 79.000đ 89.000đ
  - button "Thêm vào giỏ":
    - img
- article:
  - button "Burger Double Beef Smokehouse -9%":
    - img "Burger Double Beef Smokehouse"
    - text: "-9%"
  - text: best seller smoky
  - button "Burger Double Beef Smokehouse"
  - text: 16 phút • Burger 99.000đ 109.000đ
  - button "Thêm vào giỏ":
    - img
- article:
  - button "Combo Burger Trưa Nhanh -14%":
    - img "Combo Burger Trưa Nhanh"
    - text: "-14%"
  - text: lunch office pick
  - button "Combo Burger Trưa Nhanh"
  - text: 12 phút • Deal bữa trưa 85.000đ 99.000đ
  - button "Thêm vào giỏ":
    - img
- article:
  - button "Cơm Bò Sốt Tiêu Đen -10%":
    - img "Cơm Bò Sốt Tiêu Đen"
    - text: "-10%"
  - text: chef pick
  - button "Cơm Bò Sốt Tiêu Đen"
  - text: 16 phút • Cơm và tô 89.000đ 99.000đ
  - button "Thêm vào giỏ":
    - img
- article:
  - button "Trà Đào Tắc Mát -9%":
    - img "Trà Đào Tắc Mát"
    - text: "-9%"
  - text: refreshing
  - button "Trà Đào Tắc Mát"
  - text: 4 phút • Đồ uống 29.000đ 32.000đ
  - button "Thêm vào giỏ":
    - img
- article:
  - button "Wrap Gà Cajun -10%":
    - img "Wrap Gà Cajun"
    - text: "-10%"
  - text: handheld new
  - button "Wrap Gà Cajun"
  - text: 11 phút • Mì ý và wrap 65.000đ 72.000đ
  - button "Thêm vào giỏ":
    - img
- article:
  - button "Gà Rán 6 Miếng Honey Butter -9%":
    - img "Gà Rán 6 Miếng Honey Butter"
    - text: "-9%"
  - text: shareable sweet savory
  - button "Gà Rán 6 Miếng Honey Butter"
  - text: 19 phút • Gà rán 135.000đ 149.000đ
  - button "Thêm vào giỏ":
    - img
- article:
  - button "Family Bucket 10 Miếng -10%":
    - img "Family Bucket 10 Miếng"
    - text: "-10%"
  - text: family best value
  - button "Family Bucket 10 Miếng"
  - text: 24 phút • Ăn tối nhóm 349.000đ 389.000đ
  - button "Thêm vào giỏ":
    - img
- paragraph: 📰 Tin tức & ưu đãi
- heading "Tin menu và ưu đãi" [level=2]
- button "Tất cả"
- button "Ưu đãi"
- button "Món mới"
- button "Mẹo order"
- button "Vận hành"
- article:
  - img "Combo gà rán 2 người giảm 20% vào khung giờ 11h-14h mỗi ngày."
  - text: HOT DEAL
  - heading "Combo gà rán 2 người giảm 20% vào khung giờ 11h-14h mỗi ngày." [level=3]
  - text: FireBite Team • 11/04/2026
- article:
  - img "Cơm bò sốt tiêu đen và wrap gà cajun đã có mặt trong menu mùa hè."
  - text: MÓN MỚI
  - heading "Cơm bò sốt tiêu đen và wrap gà cajun đã có mặt trong menu mùa hè." [level=4]
  - text: FireBite Kitchen • 10/04/2026
- article:
  - img "5 cách mix combo, món ăn nhanh và đồ uống để tiết kiệm hơn khi order nhóm."
  - text: GỢI Ý
  - heading "5 cách mix combo, món ăn nhanh và đồ uống để tiết kiệm hơn khi order nhóm." [level=4]
  - text: FireBite Team • 09/04/2026
- article:
  - img "FireBite hỗ trợ giao hàng, tự đến lấy và đặt bàn trong cùng một checkout."
  - text: THÔNG BÁO
  - heading "FireBite hỗ trợ giao hàng, tự đến lấy và đặt bàn trong cùng một checkout." [level=4]
  - text: FireBite Ops • 08/04/2026
- contentinfo:
  - link "FireBite":
    - /url: /
  - paragraph: Cửa hàng fast food một điểm đến với burger, gà rán, cơm tô, mì ý, món ăn nhanh, tráng miệng và giao nhanh.
  - link "Facebook":
    - /url: "#"
    - img
  - link "YouTube":
    - /url: "#"
    - img
  - link "Instagram":
    - /url: "#"
    - img
  - link "Zalo":
    - /url: "#"
    - img
  - heading "Dịch vụ" [level=4]
  - list:
    - listitem:
      - link "Giao hàng trong ngày":
        - /url: "#"
    - listitem:
      - link "Tự đến lấy tại quán":
        - /url: "#"
    - listitem:
      - link "Đặt bàn cho nhóm":
        - /url: "#"
    - listitem:
      - link "Voucher & combo tiết kiệm":
        - /url: "#"
  - heading "Hỗ trợ" [level=4]
  - list:
    - listitem:
      - link "Hướng dẫn đặt món":
        - /url: "#"
    - listitem:
      - link "Tra cứu đơn hàng":
        - /url: "#"
    - listitem:
      - link "Chính sách hoàn tiền":
        - /url: "#"
    - listitem:
      - link "Hotline 1900 6868":
        - /url: "#"
  - heading "Liên hệ" [level=4]
  - paragraph:
    - img
    - text: 256 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội
  - paragraph:
    - img
    - text: 1900 6868
  - paragraph:
    - img
    - text: hello@firebite.vn
  - paragraph: Nhận ưu đãi mới nhất
  - textbox "Email của bạn"
  - button "Gửi"
  - paragraph: © 2026 FireBite. All rights reserved.
  - link "Điều khoản":
    - /url: "#"
  - link "Bảo mật":
    - /url: "#"
  - link "Cookies":
    - /url: "#"
```

# Test source

```ts
  1   | const { test, expect } = require("@playwright/test");
  2   | 
  3   | const BASE_URL = "https://webecommercebtl.vercel.app";
  4   | const ADMIN_USER = "admin";
  5   | const ADMIN_PASS = "Admin@123";
  6   | const TEST_USER = "khachhang";
  7   | const TEST_PASS = "Customer@123";
  8   | 
  9   | // Helper: đăng nhập
  10  | async function login(page, username, password) {
  11  |   await page.goto(`${BASE_URL}/login`);
  12  |   await page.waitForTimeout(1000);
  13  |   const emailInput = page.locator("input[type='email'], input[name='email'], input[name='username']").first();
  14  |   await emailInput.fill(username);
  15  |   await page.locator("input[type='password']").fill(password);
  16  |   await page.locator("button[type='submit']").or(page.locator("button").filter({ hasText: /đăng nhập/i })).first().click();
  17  |   await page.waitForTimeout(2000);
  18  | }
  19  | 
  20  | // ─── TRANG CHỦ ───────────────────────────────────────────────────────────────
  21  | test.describe("Trang chủ", () => {
  22  |   test("Load trang chủ thành công", async ({ page }) => {
  23  |     await page.goto(BASE_URL);
  24  |     await expect(page).toHaveTitle(/FireBite/i);
  25  |     await page.screenshot({ path: "screenshots/01-homepage.png", fullPage: true });
  26  |   });
  27  | 
  28  |   test("Hiển thị header đúng (logo, menu, giỏ hàng)", async ({ page }) => {
  29  |     await page.goto(BASE_URL);
  30  |     await expect(page.locator("a[href='/']").filter({ hasText: /FireBite/i }).first()).toBeVisible({ timeout: 8000 });
  31  |     await expect(page.locator("text=Đăng nhập")).toBeVisible();
  32  |     await expect(page.locator("text=Giỏ hàng")).toBeVisible();
  33  |   });
  34  | 
  35  |   test("Hiển thị sản phẩm nổi bật trên trang chủ", async ({ page }) => {
  36  |     await page.goto(BASE_URL);
  37  |     await page.waitForTimeout(3000);
  38  |     const cards = page.locator("[class*='product'], [class*='Product']").first();
> 39  |     await expect(cards).toBeVisible({ timeout: 10000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  40  |     await page.screenshot({ path: "screenshots/02-homepage-products.png", fullPage: true });
  41  |   });
  42  | });
  43  | 
  44  | // ─── TÌM KIẾM ────────────────────────────────────────────────────────────────
  45  | test.describe("Tìm kiếm sản phẩm", () => {
  46  |   test("Tìm kiếm 'burger' ra kết quả", async ({ page }) => {
  47  |     await page.goto(BASE_URL);
  48  |     await page.locator("input[placeholder*='Tìm']").first().fill("burger");
  49  |     await page.locator("input[placeholder*='Tìm']").first().press("Enter");
  50  |     await page.waitForTimeout(2000);
  51  |     await expect(page.locator("text=Burger").first()).toBeVisible({ timeout: 8000 });
  52  |     await page.screenshot({ path: "screenshots/03-search-burger.png", fullPage: true });
  53  |   });
  54  | 
  55  |   test("Tìm kiếm từ không tồn tại hiện thông báo", async ({ page }) => {
  56  |     await page.goto(`${BASE_URL}/products`);
  57  |     await page.locator("input[placeholder*='Tìm']").first().fill("xyzkhongcosanpham123");
  58  |     await page.locator("input[placeholder*='Tìm']").first().press("Enter");
  59  |     await page.waitForTimeout(2000);
  60  |     await expect(page.locator("text=Không tìm thấy").or(page.locator("text=0 sản phẩm"))).toBeVisible({ timeout: 8000 });
  61  |     await page.screenshot({ path: "screenshots/04-search-empty.png" });
  62  |   });
  63  | });
  64  | 
  65  | // ─── DANH SÁCH SẢN PHẨM ──────────────────────────────────────────────────────
  66  | test.describe("Trang danh sách sản phẩm", () => {
  67  |   test("Hiển thị danh sách sản phẩm", async ({ page }) => {
  68  |     await page.goto(`${BASE_URL}/products`);
  69  |     await page.waitForTimeout(3000);
  70  |     const products = page.locator("[class*='product-card'], [class*='ProductCard']");
  71  |     await expect(products.first()).toBeVisible({ timeout: 10000 });
  72  |     expect(await products.count()).toBeGreaterThan(0);
  73  |     await page.screenshot({ path: "screenshots/05-product-list.png", fullPage: true });
  74  |   });
  75  | 
  76  |   test("Bộ lọc sidebar hiển thị đúng", async ({ page }) => {
  77  |     await page.goto(`${BASE_URL}/products`);
  78  |     await expect(page.locator("text=Bộ lọc")).toBeVisible({ timeout: 8000 });
  79  |     await expect(page.locator("text=Khoảng giá")).toBeVisible();
  80  |     await expect(page.locator("text=Loại sản phẩm")).toBeVisible();
  81  |     await expect(page.locator("text=Độ cay")).toBeVisible();
  82  |     await page.screenshot({ path: "screenshots/06-filter-sidebar.png" });
  83  |   });
  84  | 
  85  |   test("Lọc theo giá hoạt động", async ({ page }) => {
  86  |     await page.goto(`${BASE_URL}/products`);
  87  |     await page.waitForTimeout(2000);
  88  |     await page.locator("text=Dưới 50.000đ").click();
  89  |     await page.waitForTimeout(2000);
  90  |     await page.screenshot({ path: "screenshots/07-filter-price.png", fullPage: true });
  91  |   });
  92  | 
  93  |   test("Lọc theo danh mục Burger", async ({ page }) => {
  94  |     await page.goto(`${BASE_URL}/products/burger`);
  95  |     await page.waitForTimeout(2000);
  96  |     await expect(page.locator("text=Burger").first()).toBeVisible({ timeout: 8000 });
  97  |     await page.screenshot({ path: "screenshots/08-filter-category.png", fullPage: true });
  98  |   });
  99  | 
  100 |   test("Lọc theo độ cay hoạt động", async ({ page }) => {
  101 |     await page.goto(`${BASE_URL}/products`);
  102 |     await page.waitForTimeout(2000);
  103 |     await page.locator("text=Cay nhẹ").or(page.locator("text=Không cay")).first().click();
  104 |     await page.waitForTimeout(2000);
  105 |     await page.screenshot({ path: "screenshots/09-filter-spice.png", fullPage: true });
  106 |   });
  107 | 
  108 |   test("Sắp xếp theo giá hoạt động", async ({ page }) => {
  109 |     await page.goto(`${BASE_URL}/products`);
  110 |     await page.waitForTimeout(2000);
  111 |     await page.locator("select").or(page.locator("[class*='sort']")).first().click();
  112 |     await page.waitForTimeout(1000);
  113 |     await page.screenshot({ path: "screenshots/10-sort.png" });
  114 |   });
  115 | });
  116 | 
  117 | // ─── CHI TIẾT SẢN PHẨM ───────────────────────────────────────────────────────
  118 | test.describe("Chi tiết sản phẩm", () => {
  119 |   test("Mở trang chi tiết sản phẩm", async ({ page }) => {
  120 |     await page.goto(`${BASE_URL}/products`);
  121 |     await page.waitForTimeout(3000);
  122 |     await page.locator("[class*='product-card']").first().click();
  123 |     await page.waitForTimeout(2000);
  124 |     await page.screenshot({ path: "screenshots/11-product-detail.png", fullPage: true });
  125 |   });
  126 | 
  127 |   test("Hiển thị nút Thêm vào giỏ hàng", async ({ page }) => {
  128 |     await page.goto(`${BASE_URL}/products`);
  129 |     await page.waitForTimeout(3000);
  130 |     await page.locator("[class*='product-card']").first().click();
  131 |     await page.waitForTimeout(2000);
  132 |     await expect(page.locator("button").filter({ hasText: /Thêm vào giỏ hàng/i }).first()).toBeVisible({ timeout: 8000 });
  133 |     await page.screenshot({ path: "screenshots/12-add-to-cart-btn.png" });
  134 |   });
  135 | 
  136 |   test("Đánh giá sản phẩm hiển thị", async ({ page }) => {
  137 |     await page.goto(`${BASE_URL}/products`);
  138 |     await page.waitForTimeout(3000);
  139 |     await page.locator("[class*='product-card']").first().click();
```