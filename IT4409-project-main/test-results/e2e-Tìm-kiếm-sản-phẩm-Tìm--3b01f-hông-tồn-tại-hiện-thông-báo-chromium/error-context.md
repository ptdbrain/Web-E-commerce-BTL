# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> Tìm kiếm sản phẩm >> Tìm kiếm từ không tồn tại hiện thông báo
- Location: tests/e2e.spec.js:55:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Không tìm thấy').or(locator('text=0 sản phẩm'))
Expected: visible
Error: strict mode violation: locator('text=Không tìm thấy').or(locator('text=0 sản phẩm')) resolved to 2 elements:
    1) <span class="product-count">…</span> aka getByText('0 sản phẩm')
    2) <h3>Không tìm thấy sản phẩm phù hợp</h3> aka getByRole('heading', { name: 'Không tìm thấy sản phẩm phù h' })

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('text=Không tìm thấy').or(locator('text=0 sản phẩm'))

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
        - textbox "Tìm kiếm" [active] [ref=e34]:
          - /placeholder: Tìm sản phẩm...
          - text: xyzkhongcosanpham123
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
    - navigation "breadcrumb" [ref=e55]:
      - list [ref=e56]:
        - listitem [ref=e57]:
          - link "Trang chủ" [ref=e58] [cursor=pointer]:
            - /url: /
          - generic [ref=e59]: /
        - listitem [ref=e60]:
          - link "Sản phẩm" [ref=e61] [cursor=pointer]:
            - /url: /products
          - generic [ref=e62]: /
        - listitem [ref=e63]:
          - generic [ref=e64]: "Tìm kiếm: \"xyzkhongcosanpham123\""
    - generic [ref=e65]:
      - complementary [ref=e66]:
        - heading "Bộ lọc" [level=2] [ref=e68]
        - generic [ref=e69]:
          - generic [ref=e70]:
            - heading "Loại sản phẩm" [level=3] [ref=e71]
            - generic [ref=e72]:
              - generic [ref=e73] [cursor=pointer]:
                - checkbox "Sản phẩm đơn" [ref=e74]
                - generic [ref=e75]: Sản phẩm đơn
              - generic [ref=e76] [cursor=pointer]:
                - checkbox "Combo" [ref=e77]
                - generic [ref=e78]: Combo
              - generic [ref=e79] [cursor=pointer]:
                - checkbox "Đồ uống" [ref=e80]
                - generic [ref=e81]: Đồ uống
              - generic [ref=e82] [cursor=pointer]:
                - checkbox "Phụ kiện" [ref=e83]
                - generic [ref=e84]: Phụ kiện
              - generic [ref=e85] [cursor=pointer]:
                - checkbox "Khác" [ref=e86]
                - generic [ref=e87]: Khác
          - generic [ref=e88]:
            - heading "Khoảng giá" [level=3] [ref=e89]
            - generic [ref=e90]:
              - generic [ref=e91] [cursor=pointer]:
                - radio "Dưới 50.000đ" [ref=e92]
                - generic [ref=e93]: Dưới 50.000đ
              - generic [ref=e94] [cursor=pointer]:
                - radio "50.000đ – 100.000đ" [ref=e95]
                - generic [ref=e96]: 50.000đ – 100.000đ
              - generic [ref=e97] [cursor=pointer]:
                - radio "100.000đ – 200.000đ" [ref=e98]
                - generic [ref=e99]: 100.000đ – 200.000đ
              - generic [ref=e100] [cursor=pointer]:
                - radio "Trên 200.000đ" [ref=e101]
                - generic [ref=e102]: Trên 200.000đ
          - generic [ref=e103]:
            - heading "Đánh giá" [level=3] [ref=e104]
            - generic [ref=e105]:
              - generic [ref=e106] [cursor=pointer]:
                - radio "Từ 4★ trở lên" [ref=e107]
                - generic [ref=e108]: Từ 4★ trở lên
              - generic [ref=e109] [cursor=pointer]:
                - radio "Từ 3★ trở lên" [ref=e110]
                - generic [ref=e111]: Từ 3★ trở lên
              - generic [ref=e112] [cursor=pointer]:
                - radio "Từ 2★ trở lên" [ref=e113]
                - generic [ref=e114]: Từ 2★ trở lên
          - generic [ref=e115]:
            - heading "Độ cay" [level=3] [ref=e116]
            - generic [ref=e117]:
              - generic [ref=e118] [cursor=pointer]:
                - checkbox "Không cay" [ref=e119]
                - generic [ref=e120]: Không cay
              - generic [ref=e121] [cursor=pointer]:
                - checkbox "Cay nhẹ" [ref=e122]
                - generic [ref=e123]: Cay nhẹ
              - generic [ref=e124] [cursor=pointer]:
                - checkbox "Cay vừa" [ref=e125]
                - generic [ref=e126]: Cay vừa
              - generic [ref=e127] [cursor=pointer]:
                - checkbox "Rất cay" [ref=e128]
                - generic [ref=e129]: Rất cay
          - generic [ref=e130]:
            - heading "Trạng thái" [level=3] [ref=e131]
            - generic [ref=e132]:
              - generic [ref=e133] [cursor=pointer]:
                - checkbox "Chỉ hiện sản phẩm còn hàng" [ref=e134]
                - generic [ref=e135]: Chỉ hiện sản phẩm còn hàng
              - generic [ref=e136] [cursor=pointer]:
                - checkbox "Chỉ hiện sản phẩm nổi bật" [ref=e137]
                - generic [ref=e138]: Chỉ hiện sản phẩm nổi bật
      - main [ref=e139]:
        - generic [ref=e140]:
          - generic [ref=e142]:
            - strong [ref=e143]: "0"
            - text: sản phẩm
          - 'button "Sắp xếp: Mặc định ▼" [ref=e146] [cursor=pointer]':
            - generic [ref=e147]: "Sắp xếp:"
            - generic [ref=e148]: Mặc định
            - generic [ref=e149]: ▼
        - generic [ref=e150]:
          - heading "Không tìm thấy sản phẩm phù hợp" [level=3] [ref=e151]
          - paragraph [ref=e152]: Hãy đổi bộ lọc hoặc thử từ khóa khác.
          - button "Xóa bộ lọc" [ref=e153] [cursor=pointer]
  - contentinfo [ref=e154]:
    - generic [ref=e157]:
      - generic [ref=e158]:
        - generic [ref=e159]:
          - link "FireBite" [ref=e160] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e161]: Cửa hàng fast food một điểm đến với burger, gà rán, cơm tô, mì ý, món ăn nhanh, tráng miệng và giao nhanh.
          - generic [ref=e162]:
            - link "Facebook" [ref=e163] [cursor=pointer]:
              - /url: "#"
              - img [ref=e164]
            - link "YouTube" [ref=e166] [cursor=pointer]:
              - /url: "#"
              - img [ref=e167]
            - link "Instagram" [ref=e169] [cursor=pointer]:
              - /url: "#"
              - img [ref=e170]
            - link "Zalo" [ref=e172] [cursor=pointer]:
              - /url: "#"
              - img [ref=e173]
        - generic [ref=e175]:
          - heading "Dịch vụ" [level=4] [ref=e176]
          - list [ref=e177]:
            - listitem [ref=e178]:
              - link "Giao hàng trong ngày" [ref=e179] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e180]:
              - link "Tự đến lấy tại quán" [ref=e181] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e182]:
              - link "Đặt bàn cho nhóm" [ref=e183] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e184]:
              - link "Voucher & combo tiết kiệm" [ref=e185] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e186]:
          - heading "Hỗ trợ" [level=4] [ref=e187]
          - list [ref=e188]:
            - listitem [ref=e189]:
              - link "Hướng dẫn đặt món" [ref=e190] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e191]:
              - link "Tra cứu đơn hàng" [ref=e192] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e193]:
              - link "Chính sách hoàn tiền" [ref=e194] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e195]:
              - link "Hotline 1900 6868" [ref=e196] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e197]:
          - heading "Liên hệ" [level=4] [ref=e198]
          - generic [ref=e199]:
            - paragraph [ref=e200]:
              - img [ref=e201]
              - generic [ref=e203]: 256 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội
            - paragraph [ref=e204]:
              - img [ref=e205]
              - generic [ref=e207]: 1900 6868
            - paragraph [ref=e208]:
              - img [ref=e209]
              - generic [ref=e211]: hello@firebite.vn
          - generic [ref=e212]:
            - paragraph [ref=e213]: Nhận ưu đãi mới nhất
            - generic [ref=e214]:
              - textbox "Email của bạn" [ref=e215]
              - button "Gửi" [ref=e216] [cursor=pointer]
      - generic [ref=e217]:
        - paragraph [ref=e218]: © 2026 FireBite. All rights reserved.
        - generic [ref=e219]:
          - link "Điều khoản" [ref=e220] [cursor=pointer]:
            - /url: "#"
          - link "Bảo mật" [ref=e221] [cursor=pointer]:
            - /url: "#"
          - link "Cookies" [ref=e222] [cursor=pointer]:
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
  39  |     await expect(cards).toBeVisible({ timeout: 10000 });
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
> 60  |     await expect(page.locator("text=Không tìm thấy").or(page.locator("text=0 sản phẩm"))).toBeVisible({ timeout: 8000 });
      |                                                                                           ^ Error: expect(locator).toBeVisible() failed
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
```