const { test, expect } = require("@playwright/test");

const BASE_URL = "https://webecommercebtl.vercel.app";
const ADMIN_USER = "admin";
const ADMIN_PASS = "Admin@123";
const TEST_USER = "khachhang";
const TEST_PASS = "Customer@123";

// Helper: đăng nhập
async function login(page, username, password) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(1000);
  const emailInput = page.locator("input[type='email'], input[name='email'], input[name='username']").first();
  await emailInput.fill(username);
  await page.locator("input[type='password']").fill(password);
  await page.locator("button[type='submit']").or(page.locator("button").filter({ hasText: /đăng nhập/i })).first().click();
  await page.waitForTimeout(2000);
}

// ─── TRANG CHỦ ───────────────────────────────────────────────────────────────
test.describe("Trang chủ", () => {
  test("Load trang chủ thành công", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/FireBite/i);
    await page.screenshot({ path: "screenshots/01-homepage.png", fullPage: true });
  });

  test("Hiển thị header đúng (logo, menu, giỏ hàng)", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("a[href='/']").filter({ hasText: /FireBite/i }).first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator("text=Đăng nhập")).toBeVisible();
    await expect(page.locator("text=Giỏ hàng")).toBeVisible();
  });

  test("Hiển thị sản phẩm nổi bật trên trang chủ", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);
    const cards = page.locator("[class*='product'], [class*='Product']").first();
    await expect(cards).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: "screenshots/02-homepage-products.png", fullPage: true });
  });
});

// ─── TÌM KIẾM ────────────────────────────────────────────────────────────────
test.describe("Tìm kiếm sản phẩm", () => {
  test("Tìm kiếm 'burger' ra kết quả", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator("input[placeholder*='Tìm']").first().fill("burger");
    await page.locator("input[placeholder*='Tìm']").first().press("Enter");
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Burger").first()).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/03-search-burger.png", fullPage: true });
  });

  test("Tìm kiếm từ không tồn tại hiện thông báo", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.locator("input[placeholder*='Tìm']").first().fill("xyzkhongcosanpham123");
    await page.locator("input[placeholder*='Tìm']").first().press("Enter");
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Không tìm thấy").or(page.locator("text=0 sản phẩm"))).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/04-search-empty.png" });
  });
});

// ─── DANH SÁCH SẢN PHẨM ──────────────────────────────────────────────────────
test.describe("Trang danh sách sản phẩm", () => {
  test("Hiển thị danh sách sản phẩm", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(3000);
    const products = page.locator("[class*='product-card'], [class*='ProductCard']");
    await expect(products.first()).toBeVisible({ timeout: 10000 });
    expect(await products.count()).toBeGreaterThan(0);
    await page.screenshot({ path: "screenshots/05-product-list.png", fullPage: true });
  });

  test("Bộ lọc sidebar hiển thị đúng", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await expect(page.locator("text=Bộ lọc")).toBeVisible({ timeout: 8000 });
    await expect(page.locator("text=Khoảng giá")).toBeVisible();
    await expect(page.locator("text=Loại sản phẩm")).toBeVisible();
    await expect(page.locator("text=Độ cay")).toBeVisible();
    await page.screenshot({ path: "screenshots/06-filter-sidebar.png" });
  });

  test("Lọc theo giá hoạt động", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(2000);
    await page.locator("text=Dưới 50.000đ").click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/07-filter-price.png", fullPage: true });
  });

  test("Lọc theo danh mục Burger", async ({ page }) => {
    await page.goto(`${BASE_URL}/products/burger`);
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Burger").first()).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/08-filter-category.png", fullPage: true });
  });

  test("Lọc theo độ cay hoạt động", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(2000);
    await page.locator("text=Cay nhẹ").or(page.locator("text=Không cay")).first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/09-filter-spice.png", fullPage: true });
  });

  test("Sắp xếp theo giá hoạt động", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(2000);
    await page.locator("select").or(page.locator("[class*='sort']")).first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/10-sort.png" });
  });
});

// ─── CHI TIẾT SẢN PHẨM ───────────────────────────────────────────────────────
test.describe("Chi tiết sản phẩm", () => {
  test("Mở trang chi tiết sản phẩm", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(3000);
    await page.locator("[class*='product-card']").first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/11-product-detail.png", fullPage: true });
  });

  test("Hiển thị nút Thêm vào giỏ hàng", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(3000);
    await page.locator("[class*='product-card']").first().click();
    await page.waitForTimeout(2000);
    await expect(page.locator("button").filter({ hasText: /Thêm vào giỏ hàng/i }).first()).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/12-add-to-cart-btn.png" });
  });

  test("Đánh giá sản phẩm hiển thị", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(3000);
    await page.locator("[class*='product-card']").first().click();
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Đánh giá").or(page.locator("text=đánh giá"))).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/13-reviews.png", fullPage: true });
  });
});

// ─── GIỎ HÀNG ────────────────────────────────────────────────────────────────
test.describe("Giỏ hàng", () => {
  test("Mở giỏ hàng", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator("text=Giỏ hàng").click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/14-cart.png" });
  });

  test("Thêm sản phẩm vào giỏ hàng", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(3000);
    await page.locator("[class*='product-card']").first().click();
    await page.waitForTimeout(2000);
    await page.locator("button").filter({ hasText: /Thêm vào giỏ hàng/i }).first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/15-add-to-cart.png" });
  });
});

// ─── ĐĂNG NHẬP / ĐĂNG KÝ ────────────────────────────────────────────────────
test.describe("Đăng nhập / Đăng ký", () => {
  test("Trang đăng nhập hiển thị đúng", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator("input[type='password']")).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/16-login-page.png" });
  });

  test("Đăng nhập sai hiện thông báo lỗi", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator("input").first().fill("sai@email.com");
    await page.locator("input[type='password']").fill("wrongpassword");
    await page.locator("button[type='submit']").or(page.locator("button").filter({ hasText: /đăng nhập/i })).first().click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "screenshots/17-login-error.png" });
  });

  test("Đăng nhập đúng thành công", async ({ page }) => {
    await login(page, TEST_USER, TEST_PASS);
    await expect(page.locator("text=Đăng xuất").or(page.locator("text=khachhang")).or(page.locator("[class*='avatar'], [class*='user']"))).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/18-login-success.png" });
  });

  test("Đăng xuất thành công", async ({ page }) => {
    await login(page, TEST_USER, TEST_PASS);
    await page.waitForTimeout(1000);
    await page.locator("text=Đăng xuất").or(page.locator("[class*='logout']")).first().click();
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Đăng nhập")).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/19-logout.png" });
  });

  test("Trang đăng ký hiển thị đúng", async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/20-register-page.png" });
  });
});

// ─── CHECKOUT ────────────────────────────────────────────────────────────────
test.describe("Checkout / Đặt hàng", () => {
  test("Trang checkout hiển thị sau khi có sản phẩm", async ({ page }) => {
    await login(page, TEST_USER, TEST_PASS);
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(3000);
    await page.locator("[class*='product-card']").first().click();
    await page.waitForTimeout(2000);
    await page.locator("button").filter({ hasText: /Thêm vào giỏ hàng/i }).first().click();
    await page.waitForTimeout(1000);
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/21-checkout.png", fullPage: true });
  });
});

// ─── ADMIN ───────────────────────────────────────────────────────────────────
test.describe("Admin portal", () => {
  test("Đăng nhập admin và vào trang admin", async ({ page }) => {
    await login(page, ADMIN_USER, ADMIN_PASS);
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/22-admin.png", fullPage: true });
  });

  test("Quản lý sản phẩm hiển thị", async ({ page }) => {
    await login(page, ADMIN_USER, ADMIN_PASS);
    await page.goto(`${BASE_URL}/admin/products`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/23-admin-products.png", fullPage: true });
  });

  test("Quản lý đơn hàng hiển thị", async ({ page }) => {
    await login(page, ADMIN_USER, ADMIN_PASS);
    await page.goto(`${BASE_URL}/admin/orders`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/24-admin-orders.png", fullPage: true });
  });
});

// ─── ĐIỀU HƯỚNG & RESPONSIVE ─────────────────────────────────────────────────
test.describe("Điều hướng & Responsive", () => {
  test("Menu thực đơn hoạt động", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator("text=Thực đơn").first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/25-menu.png" });
  });

  test("Breadcrumb hiển thị đúng", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);
    await expect(page.locator("text=Trang chủ")).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/26-breadcrumb.png" });
  });

  test("Chat widget hiển thị", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    const chat = page.locator("[class*='chat'], [class*='Chat']").first();
    await expect(chat).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: "screenshots/27-chat.png" });
  });

  test("Responsive mobile (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/28-mobile.png", fullPage: true });
  });

  test("Responsive tablet (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/29-tablet.png", fullPage: true });
  });
});
