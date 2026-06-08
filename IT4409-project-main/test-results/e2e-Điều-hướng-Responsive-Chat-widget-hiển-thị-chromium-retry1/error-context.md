# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> Điều hướng & Responsive >> Chat widget hiển thị
- Location: tests/e2e.spec.js:260:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[class*=\'chat\'], [class*=\'Chat\']').first()
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('[class*=\'chat\'], [class*=\'Chat\']').first()

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
  164 | });
  165 | 
  166 | // ─── ĐĂNG NHẬP / ĐĂNG KÝ ────────────────────────────────────────────────────
  167 | test.describe("Đăng nhập / Đăng ký", () => {
  168 |   test("Trang đăng nhập hiển thị đúng", async ({ page }) => {
  169 |     await page.goto(`${BASE_URL}/login`);
  170 |     await expect(page.locator("input[type='password']")).toBeVisible({ timeout: 8000 });
  171 |     await page.screenshot({ path: "screenshots/16-login-page.png" });
  172 |   });
  173 | 
  174 |   test("Đăng nhập sai hiện thông báo lỗi", async ({ page }) => {
  175 |     await page.goto(`${BASE_URL}/login`);
  176 |     await page.locator("input").first().fill("sai@email.com");
  177 |     await page.locator("input[type='password']").fill("wrongpassword");
  178 |     await page.locator("button[type='submit']").or(page.locator("button").filter({ hasText: /đăng nhập/i })).first().click();
  179 |     await page.waitForTimeout(3000);
  180 |     await page.screenshot({ path: "screenshots/17-login-error.png" });
  181 |   });
  182 | 
  183 |   test("Đăng nhập đúng thành công", async ({ page }) => {
  184 |     await login(page, TEST_USER, TEST_PASS);
  185 |     await expect(page.locator("text=Đăng xuất").or(page.locator("text=khachhang")).or(page.locator("[class*='avatar'], [class*='user']"))).toBeVisible({ timeout: 8000 });
  186 |     await page.screenshot({ path: "screenshots/18-login-success.png" });
  187 |   });
  188 | 
  189 |   test("Đăng xuất thành công", async ({ page }) => {
  190 |     await login(page, TEST_USER, TEST_PASS);
  191 |     await page.waitForTimeout(1000);
  192 |     await page.locator("text=Đăng xuất").or(page.locator("[class*='logout']")).first().click();
  193 |     await page.waitForTimeout(1000);
  194 |     await expect(page.locator("text=Đăng nhập")).toBeVisible({ timeout: 8000 });
  195 |     await page.screenshot({ path: "screenshots/19-logout.png" });
  196 |   });
  197 | 
  198 |   test("Trang đăng ký hiển thị đúng", async ({ page }) => {
  199 |     await page.goto(`${BASE_URL}/register`);
  200 |     await page.waitForTimeout(1000);
  201 |     await page.screenshot({ path: "screenshots/20-register-page.png" });
  202 |   });
  203 | });
  204 | 
  205 | // ─── CHECKOUT ────────────────────────────────────────────────────────────────
  206 | test.describe("Checkout / Đặt hàng", () => {
  207 |   test("Trang checkout hiển thị sau khi có sản phẩm", async ({ page }) => {
  208 |     await login(page, TEST_USER, TEST_PASS);
  209 |     await page.goto(`${BASE_URL}/products`);
  210 |     await page.waitForTimeout(3000);
  211 |     await page.locator("[class*='product-card']").first().click();
  212 |     await page.waitForTimeout(2000);
  213 |     await page.locator("button").filter({ hasText: /Thêm vào giỏ hàng/i }).first().click();
  214 |     await page.waitForTimeout(1000);
  215 |     await page.goto(`${BASE_URL}/checkout`);
  216 |     await page.waitForTimeout(2000);
  217 |     await page.screenshot({ path: "screenshots/21-checkout.png", fullPage: true });
  218 |   });
  219 | });
  220 | 
  221 | // ─── ADMIN ───────────────────────────────────────────────────────────────────
  222 | test.describe("Admin portal", () => {
  223 |   test("Đăng nhập admin và vào trang admin", async ({ page }) => {
  224 |     await login(page, ADMIN_USER, ADMIN_PASS);
  225 |     await page.goto(`${BASE_URL}/admin`);
  226 |     await page.waitForTimeout(2000);
  227 |     await page.screenshot({ path: "screenshots/22-admin.png", fullPage: true });
  228 |   });
  229 | 
  230 |   test("Quản lý sản phẩm hiển thị", async ({ page }) => {
  231 |     await login(page, ADMIN_USER, ADMIN_PASS);
  232 |     await page.goto(`${BASE_URL}/admin/products`);
  233 |     await page.waitForTimeout(2000);
  234 |     await page.screenshot({ path: "screenshots/23-admin-products.png", fullPage: true });
  235 |   });
  236 | 
  237 |   test("Quản lý đơn hàng hiển thị", async ({ page }) => {
  238 |     await login(page, ADMIN_USER, ADMIN_PASS);
  239 |     await page.goto(`${BASE_URL}/admin/orders`);
  240 |     await page.waitForTimeout(2000);
  241 |     await page.screenshot({ path: "screenshots/24-admin-orders.png", fullPage: true });
  242 |   });
  243 | });
  244 | 
  245 | // ─── ĐIỀU HƯỚNG & RESPONSIVE ─────────────────────────────────────────────────
  246 | test.describe("Điều hướng & Responsive", () => {
  247 |   test("Menu thực đơn hoạt động", async ({ page }) => {
  248 |     await page.goto(BASE_URL);
  249 |     await page.locator("text=Thực đơn").first().click();
  250 |     await page.waitForTimeout(1000);
  251 |     await page.screenshot({ path: "screenshots/25-menu.png" });
  252 |   });
  253 | 
  254 |   test("Breadcrumb hiển thị đúng", async ({ page }) => {
  255 |     await page.goto(`${BASE_URL}/products`);
  256 |     await expect(page.locator("text=Trang chủ")).toBeVisible({ timeout: 8000 });
  257 |     await page.screenshot({ path: "screenshots/26-breadcrumb.png" });
  258 |   });
  259 | 
  260 |   test("Chat widget hiển thị", async ({ page }) => {
  261 |     await page.goto(BASE_URL);
  262 |     await page.waitForTimeout(2000);
  263 |     const chat = page.locator("[class*='chat'], [class*='Chat']").first();
> 264 |     await expect(chat).toBeVisible({ timeout: 8000 });
      |                        ^ Error: expect(locator).toBeVisible() failed
  265 |     await page.screenshot({ path: "screenshots/27-chat.png" });
  266 |   });
  267 | 
  268 |   test("Responsive mobile (375px)", async ({ page }) => {
  269 |     await page.setViewportSize({ width: 375, height: 812 });
  270 |     await page.goto(BASE_URL);
  271 |     await page.waitForTimeout(2000);
  272 |     await page.screenshot({ path: "screenshots/28-mobile.png", fullPage: true });
  273 |   });
  274 | 
  275 |   test("Responsive tablet (768px)", async ({ page }) => {
  276 |     await page.setViewportSize({ width: 768, height: 1024 });
  277 |     await page.goto(BASE_URL);
  278 |     await page.waitForTimeout(2000);
  279 |     await page.screenshot({ path: "screenshots/29-tablet.png", fullPage: true });
  280 |   });
  281 | });
  282 | 
```