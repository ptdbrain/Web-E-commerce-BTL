# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> Chi tiết sản phẩm >> Đánh giá sản phẩm hiển thị
- Location: tests/e2e.spec.js:136:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Đánh giá').or(locator('text=đánh giá'))
Expected: visible
Error: strict mode violation: locator('text=Đánh giá').or(locator('text=đánh giá')) resolved to 6 elements:
    1) <span>(0 đánh giá)</span> aka getByText('(0 đánh giá)')
    2) <h2 class="text-2xl font-black text-slate-900">Đánh giá sản phẩm</h2> aka getByRole('heading', { name: 'Đánh giá sản phẩm' })
    3) <span class="mt-1 text-xs text-slate-500">0 đánh giá</span> aka getByText('0 đánh giá', { exact: true })
    4) <div class="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</div> aka getByText('Chưa có đánh giá nào. Hãy là')
    5) <h3 class="text-lg font-black text-slate-900">Viết đánh giá</h3> aka getByRole('heading', { name: 'Viết đánh giá' })
    6) <button class="mt-3 rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700">Gửi đánh giá</button> aka getByRole('button', { name: 'Gửi đánh giá' })

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('text=Đánh giá').or(locator('text=đánh giá'))

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
    - navigation [ref=e55]:
      - link "Trang chủ" [ref=e56] [cursor=pointer]:
        - /url: /
      - text: /
      - link "Burger" [ref=e57] [cursor=pointer]:
        - /url: /products/burger
      - text: /Burger Double Beef Smokehouse
    - generic [ref=e58]:
      - img "Burger Double Beef Smokehouse" [ref=e60]
      - generic [ref=e61]:
        - generic [ref=e62]:
          - generic [ref=e63]: best seller
          - generic [ref=e64]: smoky
        - heading "Burger Double Beef Smokehouse" [level=1] [ref=e65]
        - paragraph [ref=e66]: Hai lớp bò nướng, phô mai cheddar, hành giòn và sốt smokehouse.
        - generic [ref=e67]:
          - generic [ref=e68]: 16 phút
          - generic [ref=e69]: Burger
          - generic [ref=e70]:
            - generic [ref=e71]: ★
            - generic [ref=e72]: "0.0"
            - generic [ref=e73]: (0 đánh giá)
        - generic [ref=e74]:
          - generic [ref=e75]: 99.000đ
          - generic [ref=e76]: 109.000đ
        - generic [ref=e77]:
          - heading "Chọn size" [level=2] [ref=e78]
          - generic [ref=e79]:
            - button "Double" [ref=e80] [cursor=pointer]
            - button "Triple (+30.000đ)" [ref=e81] [cursor=pointer]
        - generic [ref=e82]:
          - heading "Thêm topping" [level=2] [ref=e83]
          - generic [ref=e84]:
            - button "Thêm bacon +15.000đ" [ref=e85] [cursor=pointer]:
              - generic [ref=e86]: Thêm bacon
              - generic [ref=e87]: +15.000đ
            - button "Thêm onion rings +19.000đ" [ref=e88] [cursor=pointer]:
              - generic [ref=e89]: Thêm onion rings
              - generic [ref=e90]: +19.000đ
        - generic [ref=e91]:
          - heading "Ghi chú" [level=2] [ref=e92]
          - 'textbox "Ví dụ: không hành tây, ít sốt, tách đá..." [ref=e93]'
        - generic [ref=e94]:
          - button "Thêm vào giỏ hàng" [ref=e95] [cursor=pointer]
          - button "Đặt ngay" [ref=e96] [cursor=pointer]
        - generic [ref=e97]:
          - heading "Điểm nổi bật" [level=2] [ref=e98]
          - list [ref=e99]:
            - listitem [ref=e100]: • Đỉnh đậm và đầy vị
            - listitem [ref=e101]: • Hợp người thích thịt bò
    - generic [ref=e102]:
      - generic [ref=e103]:
        - heading "Thông tin sản phẩm" [level=2] [ref=e104]
        - generic [ref=e105]:
          - generic [ref=e106]:
            - generic [ref=e107]: serving
            - generic [ref=e108]: 1 người
          - generic [ref=e109]:
            - generic [ref=e110]: calories
            - generic [ref=e111]: "880"
      - generic [ref=e112]:
        - heading "Đánh giá sản phẩm" [level=2] [ref=e113]
        - generic [ref=e114]:
          - generic [ref=e115]:
            - generic [ref=e116]: "0.0"
            - generic [ref=e117]:
              - generic [ref=e118]: ★
              - generic [ref=e119]: ★
              - generic [ref=e120]: ★
              - generic [ref=e121]: ★
              - generic [ref=e122]: ★
            - generic [ref=e123]: 0 đánh giá
          - generic [ref=e124]:
            - generic [ref=e125]:
              - generic [ref=e126]: 5 ★
              - generic [ref=e128]: "0"
            - generic [ref=e129]:
              - generic [ref=e130]: 4 ★
              - generic [ref=e132]: "0"
            - generic [ref=e133]:
              - generic [ref=e134]: 3 ★
              - generic [ref=e136]: "0"
            - generic [ref=e137]:
              - generic [ref=e138]: 2 ★
              - generic [ref=e140]: "0"
            - generic [ref=e141]:
              - generic [ref=e142]: 1 ★
              - generic [ref=e144]: "0"
        - generic [ref=e145]:
          - button "Mới nhất" [ref=e146] [cursor=pointer]
          - button "Cũ nhất" [ref=e147] [cursor=pointer]
          - button "5★ trước" [ref=e148] [cursor=pointer]
        - generic [ref=e150]: Chưa có đánh giá nào. Hãy là người đầu tiên!
        - generic [ref=e151]:
          - heading "Viết đánh giá" [level=3] [ref=e152]
          - generic [ref=e153]:
            - textbox "Tên của bạn (để trống nếu đã đăng nhập)" [ref=e154]
            - generic [ref=e155]:
              - button "★" [ref=e156] [cursor=pointer]
              - button "★" [ref=e157] [cursor=pointer]
              - button "★" [ref=e158] [cursor=pointer]
              - button "★" [ref=e159] [cursor=pointer]
              - button "★" [ref=e160] [cursor=pointer]
              - generic [ref=e161]: 5 sao
          - textbox "Chia sẻ trải nghiệm của bạn về sản phẩm..." [ref=e162]
          - button "Gửi đánh giá" [ref=e163] [cursor=pointer]
  - contentinfo [ref=e164]:
    - generic [ref=e167]:
      - generic [ref=e168]:
        - generic [ref=e169]:
          - link "FireBite" [ref=e170] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e171]: Cửa hàng fast food một điểm đến với burger, gà rán, cơm tô, mì ý, món ăn nhanh, tráng miệng và giao nhanh.
          - generic [ref=e172]:
            - link "Facebook" [ref=e173] [cursor=pointer]:
              - /url: "#"
              - img [ref=e174]
            - link "YouTube" [ref=e176] [cursor=pointer]:
              - /url: "#"
              - img [ref=e177]
            - link "Instagram" [ref=e179] [cursor=pointer]:
              - /url: "#"
              - img [ref=e180]
            - link "Zalo" [ref=e182] [cursor=pointer]:
              - /url: "#"
              - img [ref=e183]
        - generic [ref=e185]:
          - heading "Dịch vụ" [level=4] [ref=e186]
          - list [ref=e187]:
            - listitem [ref=e188]:
              - link "Giao hàng trong ngày" [ref=e189] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e190]:
              - link "Tự đến lấy tại quán" [ref=e191] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e192]:
              - link "Đặt bàn cho nhóm" [ref=e193] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e194]:
              - link "Voucher & combo tiết kiệm" [ref=e195] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e196]:
          - heading "Hỗ trợ" [level=4] [ref=e197]
          - list [ref=e198]:
            - listitem [ref=e199]:
              - link "Hướng dẫn đặt món" [ref=e200] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e201]:
              - link "Tra cứu đơn hàng" [ref=e202] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e203]:
              - link "Chính sách hoàn tiền" [ref=e204] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e205]:
              - link "Hotline 1900 6868" [ref=e206] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e207]:
          - heading "Liên hệ" [level=4] [ref=e208]
          - generic [ref=e209]:
            - paragraph [ref=e210]:
              - img [ref=e211]
              - generic [ref=e213]: 256 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội
            - paragraph [ref=e214]:
              - img [ref=e215]
              - generic [ref=e217]: 1900 6868
            - paragraph [ref=e218]:
              - img [ref=e219]
              - generic [ref=e221]: hello@firebite.vn
          - generic [ref=e222]:
            - paragraph [ref=e223]: Nhận ưu đãi mới nhất
            - generic [ref=e224]:
              - textbox "Email của bạn" [ref=e225]
              - button "Gửi" [ref=e226] [cursor=pointer]
      - generic [ref=e227]:
        - paragraph [ref=e228]: © 2026 FireBite. All rights reserved.
        - generic [ref=e229]:
          - link "Điều khoản" [ref=e230] [cursor=pointer]:
            - /url: "#"
          - link "Bảo mật" [ref=e231] [cursor=pointer]:
            - /url: "#"
          - link "Cookies" [ref=e232] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
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
  140 |     await page.waitForTimeout(2000);
> 141 |     await expect(page.locator("text=Đánh giá").or(page.locator("text=đánh giá"))).toBeVisible({ timeout: 8000 });
      |                                                                                   ^ Error: expect(locator).toBeVisible() failed
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
```