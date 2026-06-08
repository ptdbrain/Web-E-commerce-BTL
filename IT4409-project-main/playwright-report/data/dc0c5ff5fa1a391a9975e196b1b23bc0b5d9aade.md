# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> Đăng nhập / Đăng ký >> Đăng xuất thành công
- Location: tests/e2e.spec.js:189:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Đăng xuất').or(locator('[class*=\'logout\']')).first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img [ref=e8]
        - generic [ref=e11]: 09:00 - 22:30 mỗi ngày
      - generic [ref=e12]:
        - img [ref=e13]
        - generic [ref=e16]: 256 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội
    - generic [ref=e17]:
      - generic [ref=e18]:
        - button "Fire Bite" [ref=e19] [cursor=pointer]:
          - generic [ref=e20]: Fire
          - generic [ref=e21]: Bite
        - button "Thực đơn" [ref=e23] [cursor=pointer]:
          - img [ref=e24]
          - generic [ref=e25]: Thực đơn
          - img [ref=e26]
      - generic [ref=e30]:
        - img [ref=e31]
        - textbox "Tìm kiếm" [ref=e34]:
          - /placeholder: Tìm sản phẩm...
        - generic [ref=e35]:
          - img [ref=e36]
          - generic [ref=e39]: Enter
      - generic [ref=e40]:
        - generic [ref=e41]:
          - generic [ref=e42]: 1900 6868
          - generic [ref=e43]: Giao hàng • Pickup
        - link "Đăng nhập" [ref=e44] [cursor=pointer]:
          - /url: /login
          - img [ref=e45]
          - text: Đăng nhập
        - button "Giỏ hàng" [ref=e48] [cursor=pointer]:
          - img [ref=e49]
          - generic [ref=e53]: Giỏ hàng
  - generic [ref=e54]:
    - generic [ref=e58]:
      - generic [ref=e59]: 🍔
      - heading "Chào mừng trở lại FireBite" [level=2] [ref=e60]:
        - text: Chào mừng trở lại
        - text: FireBite
      - paragraph [ref=e61]: Đăng nhập để đặt món, theo dõi đơn hàng và nhận ưu đãi riêng.
    - generic [ref=e64]:
      - heading "Đăng nhập" [level=2] [ref=e65]
      - paragraph [ref=e66]: Nhập thông tin tài khoản của bạn
      - generic [ref=e67]:
        - generic [ref=e68]:
          - generic [ref=e69]: Tên đăng nhập
          - generic [ref=e70]:
            - img [ref=e71]
            - textbox "Tên đăng nhập" [active] [ref=e74]
        - generic [ref=e75]:
          - generic [ref=e76]: Mật khẩu
          - generic [ref=e77]:
            - img [ref=e78]
            - textbox "Mật khẩu" [ref=e81]: Customer@123
        - button "Đăng nhập" [ref=e82] [cursor=pointer]:
          - text: Đăng nhập
          - img [ref=e83]
      - generic [ref=e85]:
        - button "Quên mật khẩu?" [ref=e86] [cursor=pointer]
        - generic [ref=e87]:
          - text: Chưa có tài khoản?
          - link "Đăng ký" [ref=e88] [cursor=pointer]:
            - /url: /register
  - contentinfo [ref=e89]:
    - generic [ref=e92]:
      - generic [ref=e93]:
        - generic [ref=e94]:
          - link "FireBite" [ref=e95] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e96]: Cửa hàng fast food một điểm đến với burger, gà rán, cơm tô, mì ý, món ăn nhanh, tráng miệng và giao nhanh.
          - generic [ref=e97]:
            - link "Facebook" [ref=e98] [cursor=pointer]:
              - /url: "#"
              - img [ref=e99]
            - link "YouTube" [ref=e101] [cursor=pointer]:
              - /url: "#"
              - img [ref=e102]
            - link "Instagram" [ref=e104] [cursor=pointer]:
              - /url: "#"
              - img [ref=e105]
            - link "Zalo" [ref=e107] [cursor=pointer]:
              - /url: "#"
              - img [ref=e108]
        - generic [ref=e110]:
          - heading "Dịch vụ" [level=4] [ref=e111]
          - list [ref=e112]:
            - listitem [ref=e113]:
              - link "Giao hàng trong ngày" [ref=e114] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e115]:
              - link "Tự đến lấy tại quán" [ref=e116] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e117]:
              - link "Đặt bàn cho nhóm" [ref=e118] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e119]:
              - link "Voucher & combo tiết kiệm" [ref=e120] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e121]:
          - heading "Hỗ trợ" [level=4] [ref=e122]
          - list [ref=e123]:
            - listitem [ref=e124]:
              - link "Hướng dẫn đặt món" [ref=e125] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e126]:
              - link "Tra cứu đơn hàng" [ref=e127] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e128]:
              - link "Chính sách hoàn tiền" [ref=e129] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e130]:
              - link "Hotline 1900 6868" [ref=e131] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e132]:
          - heading "Liên hệ" [level=4] [ref=e133]
          - generic [ref=e134]:
            - paragraph [ref=e135]:
              - img [ref=e136]
              - generic [ref=e138]: 256 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội
            - paragraph [ref=e139]:
              - img [ref=e140]
              - generic [ref=e142]: 1900 6868
            - paragraph [ref=e143]:
              - img [ref=e144]
              - generic [ref=e146]: hello@firebite.vn
          - generic [ref=e147]:
            - paragraph [ref=e148]: Nhận ưu đãi mới nhất
            - generic [ref=e149]:
              - textbox "Email của bạn" [ref=e150]: khachhang
              - button "Gửi" [ref=e151] [cursor=pointer]
      - generic [ref=e152]:
        - paragraph [ref=e153]: © 2026 FireBite. All rights reserved.
        - generic [ref=e154]:
          - link "Điều khoản" [ref=e155] [cursor=pointer]:
            - /url: "#"
          - link "Bảo mật" [ref=e156] [cursor=pointer]:
            - /url: "#"
          - link "Cookies" [ref=e157] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
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
  140 |     await page.waitForTimeout(2000);
  141 |     await expect(page.locator("text=Đánh giá").or(page.locator("text=đánh giá"))).toBeVisible({ timeout: 8000 });
  142 |     await page.screenshot({ path: "screenshots/13-reviews.png", fullPage: true });
  143 |   });
  144 | });
  145 | 
  146 | // ─── GIỎ HÀNG ────────────────────────────────────────────────────────────────
  147 | test.describe("Giỏ hàng", () => {
  148 |   test("Mở giỏ hàng", async ({ page }) => {
  149 |     await page.goto(BASE_URL);
  150 |     await page.locator("text=Giỏ hàng").click();
  151 |     await page.waitForTimeout(1000);
  152 |     await page.screenshot({ path: "screenshots/14-cart.png" });
  153 |   });
  154 | 
  155 |   test("Thêm sản phẩm vào giỏ hàng", async ({ page }) => {
  156 |     await page.goto(`${BASE_URL}/products`);
  157 |     await page.waitForTimeout(3000);
  158 |     await page.locator("[class*='product-card']").first().click();
  159 |     await page.waitForTimeout(2000);
  160 |     await page.locator("button").filter({ hasText: /Thêm vào giỏ hàng/i }).first().click();
  161 |     await page.waitForTimeout(1000);
  162 |     await page.screenshot({ path: "screenshots/15-add-to-cart.png" });
  163 |   });
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
> 192 |     await page.locator("text=Đăng xuất").or(page.locator("[class*='logout']")).first().click();
      |                                                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  264 |     await expect(chat).toBeVisible({ timeout: 8000 });
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