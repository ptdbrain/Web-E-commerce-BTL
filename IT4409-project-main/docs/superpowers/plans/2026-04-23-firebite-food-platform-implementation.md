# FireBite Food Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoan thien repo FireBite thanh he thong ban do an nhat quan tu catalog, product detail, cart, checkout, order den voucher va admin, dong thoi loai bo domain do dien tu khoi luong runtime chinh.

**Architecture:** Ke hoach nay giu mot plan duy nhat vi product, cart, order va voucher dang chia se cung contract du lieu. Trinh tu thuc hien di tu domain backend va seed, sau do mo rong cart/voucher, roi moi cap nhat storefront/admin de frontend va backend dung cung shape du lieu.

**Tech Stack:** Express 5, MongoDB/Mongoose, Redis, React 19, Vite 5, Axios, TanStack Query, Node built-in test runner

---

## File Structure Map

### Backend domain and API

- Create: `IT4409-project-main/backend/utils/productQuery.js`
- Create: `IT4409-project-main/backend/utils/cartDomain.js`
- Create: `IT4409-project-main/backend/utils/voucherPricing.js`
- Create: `IT4409-project-main/backend/controllers/cartController.js`
- Create: `IT4409-project-main/backend/routes/cartRoutes.js`
- Modify: `IT4409-project-main/backend/models/Product.js`
- Modify: `IT4409-project-main/backend/models/Category.js`
- Modify: `IT4409-project-main/backend/models/Cart.js`
- Modify: `IT4409-project-main/backend/models/Voucher.js`
- Modify: `IT4409-project-main/backend/utils/menuDomain.js`
- Modify: `IT4409-project-main/backend/controllers/productController.js`
- Modify: `IT4409-project-main/backend/controllers/orderController.js`
- Modify: `IT4409-project-main/backend/controllers/voucherController.js`
- Modify: `IT4409-project-main/backend/routes/productsRoutes.js`
- Modify: `IT4409-project-main/backend/routes/voucherRoutes.js`
- Modify: `IT4409-project-main/backend/routes/categoriesRoutes.js`
- Modify: `IT4409-project-main/backend/server.js`
- Modify: `IT4409-project-main/backend/scripts/seedFoodCatalog.js`
- Delete: `IT4409-project-main/backend/routes/brandsRoutes.js`
- Delete: `IT4409-project-main/backend/models/Brand.js`
- Delete: `IT4409-project-main/backend/scripts/createBrand.js`
- Delete: `IT4409-project-main/backend/scripts/createBrandCatagory.js`
- Delete: `IT4409-project-main/backend/scripts/createProducts.js`
- Delete: `IT4409-project-main/backend/scripts/createCatagory.js`

### Backend tests

- Modify: `IT4409-project-main/backend/tests/menuDomain.test.js`
- Create: `IT4409-project-main/backend/tests/productQuery.test.js`
- Create: `IT4409-project-main/backend/tests/cartDomain.test.js`
- Create: `IT4409-project-main/backend/tests/voucherPricing.test.js`
- Create: `IT4409-project-main/backend/tests/orderVoucherConsistency.test.js`

### Frontend storefront and admin

- Create: `IT4409-project-main/frontend/src/api/cartApi.js`
- Create: `IT4409-project-main/frontend/src/utils/cartPayload.js`
- Create: `IT4409-project-main/frontend/src/utils/checkoutPricing.js`
- Modify: `IT4409-project-main/frontend/src/api/productsApi.js`
- Modify: `IT4409-project-main/frontend/src/api/categoriesApi.js`
- Modify: `IT4409-project-main/frontend/src/contexts/CartContext.jsx`
- Modify: `IT4409-project-main/frontend/src/data/menuData.js`
- Modify: `IT4409-project-main/frontend/src/data/categories.jsx`
- Modify: `IT4409-project-main/frontend/src/components/filters/FilterSidebar/FilterSidebar.jsx`
- Modify: `IT4409-project-main/frontend/src/pages/ProductListingPage/ProductListingPage.jsx`
- Modify: `IT4409-project-main/frontend/src/pages/ProductDetail/ProductDetailPage.jsx`
- Modify: `IT4409-project-main/frontend/src/components/cart/OrderSummary.jsx`
- Modify: `IT4409-project-main/frontend/src/pages/CheckoutPage.jsx`
- Modify: `IT4409-project-main/frontend/src/components/admin/AdminProducts.jsx`
- Modify: `IT4409-project-main/frontend/src/components/admin/AdminVouchers.jsx`
- Modify: `IT4409-project-main/frontend/src/components/admin/utils.js`
- Delete: `IT4409-project-main/frontend/src/data/filterConfigs.js`
- Delete: `IT4409-project-main/frontend/src/components/filters/FilterSidebar/BrandFilter.jsx`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/ProductGallery/ProductGallery.jsx`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/ProductGallery/ProductGallery.css`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/ProductGallery/index.js`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/ProductInfo/ProductInfo.jsx`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/ProductInfo/ProductInfo.css`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/ProductInfo/index.js`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/ReviewsSection/ReviewsSection.jsx`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/ReviewsSection/ReviewsSection.css`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/ReviewsSection/index.js`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/SpecificationsTable/SpecificationsTable.jsx`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/SpecificationsTable/SpecificationsTable.css`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/SpecificationsTable/index.js`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/VariantSelector/VariantSelector.jsx`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/VariantSelector/VariantSelector.css`
- Delete: `IT4409-project-main/frontend/src/components/ProductDetail/VariantSelector/index.js`
- Delete: `IT4409-project-main/frontend/src/components/admin/ProductForm.jsx`
- Delete: `IT4409-project-main/frontend/src/pages/admin/AdminProductPage.jsx`
- Delete: `IT4409-project-main/frontend/src/pages/admin/AdminOverviewPage.jsx`
- Delete: `IT4409-project-main/frontend/src/assets/AKKO.webp`
- Delete: `IT4409-project-main/frontend/src/assets/Balo .jfif`
- Delete: `IT4409-project-main/frontend/src/assets/Bàn phím.jfif`
- Delete: `IT4409-project-main/frontend/src/assets/Chuột.webp`
- Delete: `IT4409-project-main/frontend/src/assets/Lenovo.webp`
- Delete: `IT4409-project-main/frontend/src/assets/LenovoLOQ.jfif`
- Delete: `IT4409-project-main/frontend/src/assets/chuột logitech G102.jpg`
- Delete: `IT4409-project-main/frontend/src/assets/laptop.webp`

### Frontend tests

- Create: `IT4409-project-main/frontend/tests/menuData.test.js`
- Create: `IT4409-project-main/frontend/tests/productsApi.test.js`
- Create: `IT4409-project-main/frontend/tests/cartPayload.test.js`
- Create: `IT4409-project-main/frontend/tests/checkoutPricing.test.js`
- Create: `IT4409-project-main/frontend/tests/adminUtils.test.js`
- Modify: `IT4409-project-main/frontend/tests/cartItem.test.js`

## Task 1: Normalize Menu Domain and Product API

**Files:**
- Create: `IT4409-project-main/backend/utils/productQuery.js`
- Modify: `IT4409-project-main/backend/models/Product.js`
- Modify: `IT4409-project-main/backend/models/Category.js`
- Modify: `IT4409-project-main/backend/utils/menuDomain.js`
- Modify: `IT4409-project-main/backend/controllers/productController.js`
- Modify: `IT4409-project-main/backend/routes/productsRoutes.js`
- Modify: `IT4409-project-main/backend/routes/categoriesRoutes.js`
- Modify: `IT4409-project-main/backend/server.js`
- Test: `IT4409-project-main/backend/tests/menuDomain.test.js`
- Test: `IT4409-project-main/backend/tests/productQuery.test.js`

- [ ] **Step 1: Write the failing tests for menu payload normalization and product filters**

```js
// backend/tests/productQuery.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { buildProductFilter } from "../utils/productQuery.js";

test("buildProductFilter maps food query params only", () => {
  const filter = buildProductFilter({
    search: "burger",
    category: "burger",
    itemType: "single",
    spiceLevel: "medium",
    available: "true",
    featured: "true",
  });

  assert.equal(filter.categorySlug, "burger");
  assert.equal(filter.itemType, "single");
  assert.equal(filter.spiceLevel, "medium");
  assert.equal(filter.isAvailable, true);
  assert.equal(filter.isFeatured, true);
  assert.match(filter.searchRegex, /burger/i);
});
```

```js
// append to backend/tests/menuDomain.test.js
test("normalizeMenuProductPayload keeps only food-centric product fields", () => {
  const payload = normalizeMenuProductPayload({
    name: "Burger bo pho mai",
    price: "89000",
    stock: "12",
    soldCount: "34",
    spiceLevel: "mild",
    sizes: JSON.stringify([{ label: "Regular", priceModifier: 0, isDefault: true }]),
    specifications: JSON.stringify({
      serving: "1 nguoi",
      calories: "620 kcal",
      ingredients: ["bo", "pho mai"],
    }),
  });

  assert.equal(payload.name, "Burger bo pho mai");
  assert.equal(payload.price, 89000);
  assert.equal(payload.soldCount, 34);
  assert.equal(payload.spiceLevel, "mild");
  assert.deepEqual(payload.specifications.ingredients, ["bo", "pho mai"]);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/menuDomain.test.js tests/productQuery.test.js`

Expected: FAIL because `buildProductFilter` does not exist and `soldCount` is not returned by `normalizeMenuProductPayload`.

- [ ] **Step 3: Implement the product schema and normalization changes**

```js
// backend/models/Product.js
soldCount: {
  type: Number,
  default: 0,
  min: 0,
},
specifications: {
  type: mongoose.Schema.Types.Mixed,
  default: {},
},
```

```js
// backend/utils/menuDomain.js
export const normalizeMenuProductPayload = (payload = {}) => {
  const specifications = parseJson(payload.specifications, {});
  return {
    name: String(payload.name || "").trim(),
    slug: payload.slug ? slugify(payload.slug) : slugify(payload.name || ""),
    description: String(payload.description || "").trim(),
    price: toNumber(payload.price, 0),
    discountPrice:
      payload.discountPrice === undefined || payload.discountPrice === ""
        ? undefined
        : toNumber(payload.discountPrice, 0),
    stock: Math.max(0, toNumber(payload.stock, 0)),
    soldCount: Math.max(0, toNumber(payload.soldCount, 0)),
    itemType: String(payload.itemType || "single").trim() || "single",
    preparationTime: Math.max(0, toNumber(payload.preparationTime, 15)),
    spiceLevel: String(payload.spiceLevel || "").trim(),
    sizes,
    addons,
    comboItems,
    badges,
    highlights,
    specifications: specifications && typeof specifications === "object" ? specifications : {},
    isAvailable: toBoolean(payload.isAvailable, true),
    isActive: toBoolean(payload.isActive, true),
    isBestSeller: toBoolean(payload.isBestSeller, false),
    isNew: toBoolean(payload.isNew, false),
  };
};
```

- [ ] **Step 4: Add the reusable product filter helper and the `GET /products/:id` route**

```js
// backend/utils/productQuery.js
export const buildProductFilter = (query = {}) => ({
  searchRegex: query.search ? new RegExp(String(query.search).trim(), "i") : null,
  categorySlug: query.category ? String(query.category).trim() : "",
  itemType: query.itemType ? String(query.itemType).trim() : "",
  spiceLevel: query.spiceLevel ? String(query.spiceLevel).trim() : "",
  isAvailable: query.available === "true",
  isFeatured: query.featured === "true",
});
```

```js
// backend/routes/productsRoutes.js
router.get("/products/:id", productController.getProductById);
```

```js
// backend/controllers/productController.js
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name slug");
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product);
};
```

- [ ] **Step 5: Remove brand from the active runtime**

```js
// backend/server.js
// remove: import brandsRoutes from "./routes/brandsRoutes.js";

app.use("/api", productsRoutes);
app.use("/api", categoriesRoutes);
// remove: app.use("/api", brandsRoutes);
```

```bash
git rm IT4409-project-main/backend/routes/brandsRoutes.js
git rm IT4409-project-main/backend/models/Brand.js
git rm IT4409-project-main/backend/scripts/createBrand.js
git rm IT4409-project-main/backend/scripts/createBrandCatagory.js
git rm IT4409-project-main/backend/scripts/createProducts.js
git rm IT4409-project-main/backend/scripts/createCatagory.js
```

- [ ] **Step 6: Run the backend domain tests**

Run: `node --test tests/menuDomain.test.js tests/productQuery.test.js`

Expected: PASS with all assertions green.

- [ ] **Step 7: Commit**

```bash
git add backend/models/Product.js backend/models/Category.js backend/utils/menuDomain.js backend/utils/productQuery.js backend/controllers/productController.js backend/routes/productsRoutes.js backend/routes/categoriesRoutes.js backend/server.js backend/tests/menuDomain.test.js backend/tests/productQuery.test.js
git commit -m "refactor(backend): normalize FireBite product domain"
```

### Task 2: Add Cart API and Align Order Snapshot Items

**Files:**
- Create: `IT4409-project-main/backend/utils/cartDomain.js`
- Create: `IT4409-project-main/backend/controllers/cartController.js`
- Create: `IT4409-project-main/backend/routes/cartRoutes.js`
- Modify: `IT4409-project-main/backend/models/Cart.js`
- Modify: `IT4409-project-main/backend/utils/menuDomain.js`
- Modify: `IT4409-project-main/backend/controllers/orderController.js`
- Modify: `IT4409-project-main/backend/server.js`
- Test: `IT4409-project-main/backend/tests/cartDomain.test.js`
- Test: `IT4409-project-main/backend/tests/menuDomain.test.js`

- [ ] **Step 1: Write the failing tests for cart merging and food item snapshots**

```js
// backend/tests/cartDomain.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { upsertCartItem, updateCartItemQuantity } from "../utils/cartDomain.js";

test("upsertCartItem merges items by cartKey and increases quantity", () => {
  const next = upsertCartItem(
    [{ cartKey: "burger::m::cheese::", quantity: 1, unitPrice: 69000, lineTotal: 69000 }],
    { cartKey: "burger::m::cheese::", quantity: 2, unitPrice: 69000, lineTotal: 138000 }
  );

  assert.deepEqual(next, [
    { cartKey: "burger::m::cheese::", quantity: 3, unitPrice: 69000, lineTotal: 207000 },
  ]);
});
```

```js
// append to backend/tests/menuDomain.test.js
test("normalizeOrderItem computes unitPrice and lineTotal from size and add-ons", () => {
  const normalized = normalizeOrderItem({
    productId: "64f100000000000000000002",
    productName: "Burger Ga Gion Mat Ong",
    quantity: 2,
    price: 69000,
    selectedSize: { label: "Double Patty", priceModifier: 22000 },
    selectedAddons: [{ label: "Them pho mai", price: 9000, quantity: 1 }],
  });

  assert.equal(normalized.unitPrice, 100000);
  assert.equal(normalized.lineTotal, 200000);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/menuDomain.test.js tests/cartDomain.test.js`

Expected: FAIL because `upsertCartItem` does not exist and `normalizeOrderItem` does not yet output the expected totals for the tested shape.

- [ ] **Step 3: Implement the cart model and cart domain helper**

```js
// backend/models/Cart.js
items: [
  {
    cartKey: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    productImage: { type: String, default: "" },
    quantity: { type: Number, required: true, default: 1 },
    selectedSize: {
      label: { type: String },
      priceModifier: { type: Number, default: 0 },
    },
    selectedAddons: [
      {
        label: { type: String },
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
      },
    ],
    itemNote: { type: String, default: "" },
    basePrice: { type: Number, required: true, default: 0 },
    unitPrice: { type: Number, required: true, default: 0 },
    lineTotal: { type: Number, required: true, default: 0 },
  },
],
```

```js
// backend/utils/cartDomain.js
export const upsertCartItem = (items = [], incomingItem) => {
  const existing = items.find((item) => item.cartKey === incomingItem.cartKey);
  if (!existing) return [...items, incomingItem];
  return items.map((item) =>
    item.cartKey === incomingItem.cartKey
      ? {
          ...item,
          quantity: item.quantity + incomingItem.quantity,
          lineTotal: item.unitPrice * (item.quantity + incomingItem.quantity),
        }
      : item
  );
};
```

- [ ] **Step 4: Add cart controller and routes**

```js
// backend/routes/cartRoutes.js
router.get("/cart", authenticateToken, cartController.getMyCart);
router.post("/cart/items", authenticateToken, cartController.addCartItem);
router.put("/cart/items/:cartKey", authenticateToken, cartController.updateCartItem);
router.delete("/cart/items/:cartKey", authenticateToken, cartController.removeCartItem);
```

```js
// backend/controllers/cartController.js
const incoming = normalizeOrderItem(req.body);
const cartItem = {
  cartKey: req.body.cartKey,
  productId: incoming.productId,
  productName: incoming.productName,
  productImage: incoming.productImage,
  quantity: incoming.quantity,
  selectedSize: incoming.selectedSize,
  selectedAddons: incoming.selectedAddons,
  itemNote: incoming.itemNote,
  basePrice: incoming.price,
  unitPrice: incoming.unitPrice,
  lineTotal: incoming.lineTotal,
};
```

- [ ] **Step 5: Mount cart routes and keep order payload aligned with cart items**

```js
// backend/server.js
app.use("/api", cartRoutes);
```

```js
// backend/controllers/orderController.js
const normalizedItems = items.map((item) => {
  const normalized = normalizeOrderItem(item);
  if (!normalized.productId || !mongoose.isValidObjectId(normalized.productId)) {
    throw new Error("Invalid productId in items");
  }
  if (!normalized.productName) {
    throw new Error("productName is required in items");
  }
  return normalized;
});
```

- [ ] **Step 6: Run the backend cart tests**

Run: `node --test tests/menuDomain.test.js tests/cartDomain.test.js`

Expected: PASS with cart merge behavior and order price math verified.

- [ ] **Step 7: Commit**

```bash
git add backend/models/Cart.js backend/utils/cartDomain.js backend/controllers/cartController.js backend/routes/cartRoutes.js backend/utils/menuDomain.js backend/controllers/orderController.js backend/server.js backend/tests/cartDomain.test.js backend/tests/menuDomain.test.js
git commit -m "feat(backend): add FireBite cart API and order snapshots"
```

### Task 3: Expand FireBite Categories, Menu Data, and Seed Catalog

**Files:**
- Modify: `IT4409-project-main/backend/models/Category.js`
- Modify: `IT4409-project-main/backend/scripts/seedFoodCatalog.js`
- Modify: `IT4409-project-main/backend/package.json`
- Modify: `IT4409-project-main/frontend/src/data/categories.jsx`
- Modify: `IT4409-project-main/frontend/src/data/menuData.js`
- Test: `IT4409-project-main/frontend/tests/menuData.test.js`

- [ ] **Step 1: Write the failing catalog coverage test**

```js
// frontend/tests/menuData.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { categories } from "../src/data/categories.jsx";
import { menuProducts } from "../src/data/menuData.js";

test("menu data covers the FireBite category set with realistic volume", () => {
  assert.ok(menuProducts.length >= 28);

  const slugs = new Set(categories.map((item) => item.slug));
  [
    "burger",
    "fried-chicken",
    "rice-bowls",
    "pasta-wraps",
    "soups-salads",
    "desserts",
    "drinks",
    "combo",
    "group-meals",
    "lunch-deals",
  ].forEach((slug) => assert.ok(slugs.has(slug)));
});
```

- [ ] **Step 2: Run the catalog test to verify it fails**

Run: `node --test tests/menuData.test.js`

Expected: FAIL because the current category list and menu volume do not satisfy the new assertions.

- [ ] **Step 3: Update the default categories and frontend category source**

```js
// backend/models/Category.js
export const DEFAULT_CATEGORIES = [
  "Burger",
  "Ga ran",
  "Com to",
  "My y & wrap",
  "Mon phu",
  "Soup & salad",
  "Do uong",
  "Trang mieng",
  "Combo",
  "An toi nhom",
  "Deal bua trua",
];
```

```js
// frontend/src/data/categories.jsx
export const categories = [
  { id: "burger", slug: "burger", name: "Burger", image: "https://img.icons8.com/color/96/hamburger.png" },
  { id: "fried-chicken", slug: "fried-chicken", name: "Ga ran", image: "https://img.icons8.com/color/96/fried-chicken.png" },
  { id: "rice-bowls", slug: "rice-bowls", name: "Com to", image: "https://img.icons8.com/color/96/rice-bowl.png" },
  { id: "pasta-wraps", slug: "pasta-wraps", name: "My y & wrap", image: "https://img.icons8.com/color/96/spaghetti.png" },
  { id: "soups-salads", slug: "soups-salads", name: "Soup & salad", image: "https://img.icons8.com/color/96/soup-plate.png" },
  { id: "desserts", slug: "desserts", name: "Trang mieng", image: "https://img.icons8.com/color/96/ice-cream-bowl.png" },
  { id: "drinks", slug: "drinks", name: "Do uong", image: "https://img.icons8.com/color/96/soda-cup.png" },
  { id: "combo", slug: "combo", name: "Combo", image: "https://img.icons8.com/color/96/meal.png" },
  { id: "group-meals", slug: "group-meals", name: "An toi nhom", image: "https://img.icons8.com/color/96/dinner.png" },
  { id: "lunch-deals", slug: "lunch-deals", name: "Deal bua trua", image: "https://img.icons8.com/color/96/lunchbox.png" },
];
```

- [ ] **Step 4: Expand `menuData.js` and keep backend seed in sync**

```js
// each product object in frontend/src/data/menuData.js
{
  _id: "64f100000000000000000011",
  id: "64f100000000000000000011",
  name: "Com Ga Sot Tieu Den",
  slug: "com-ga-sot-tieu-den",
  description: "Com ga chien gion an kem trung long dao, rau tron va sot tieu den.",
  category: { name: "Com to", slug: "rice-bowls" },
  itemType: "single",
  price: 89000,
  discountPrice: 79000,
  stock: 25,
  soldCount: 184,
  rating: 4.8,
  numReviews: 72,
  isAvailable: true,
  images: ["https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80"],
  sizes: [{ label: "Regular", priceModifier: 0, isDefault: true }],
  addons: [{ label: "Them ga gion", price: 25000, maxQuantity: 2 }],
  comboItems: [],
  badges: ["chef_pick"],
  highlights: ["Com nau trong ngay", "Ga sot tieu den dam vi"],
  specifications: {
    serving: "1 nguoi",
    calories: "710 kcal",
    ingredients: ["ga", "com", "trung"],
    allergens: ["trung"],
  },
}
```

```js
// backend/scripts/seedFoodCatalog.js
const categoryDocs = await Category.insertMany(
  categories.map((category) => ({
    name: category.name,
    slug: category.slug,
    image: category.image,
    isActive: true,
  }))
);
```

- [ ] **Step 5: Run the data checks**

Run: `node --test tests/menuData.test.js`

Run: `node --check scripts/seedFoodCatalog.js`

Expected: Both commands succeed.

- [ ] **Step 6: Commit**

```bash
git add backend/models/Category.js backend/scripts/seedFoodCatalog.js backend/package.json frontend/src/data/categories.jsx frontend/src/data/menuData.js frontend/tests/menuData.test.js
git commit -m "feat(data): expand FireBite menu and category seed data"
```

### Task 4: Build the Shared Voucher Pricing Engine

**Files:**
- Create: `IT4409-project-main/backend/utils/voucherPricing.js`
- Modify: `IT4409-project-main/backend/models/Voucher.js`
- Modify: `IT4409-project-main/backend/controllers/voucherController.js`
- Modify: `IT4409-project-main/backend/controllers/orderController.js`
- Modify: `IT4409-project-main/backend/routes/voucherRoutes.js`
- Test: `IT4409-project-main/backend/tests/voucherPricing.test.js`
- Test: `IT4409-project-main/backend/tests/orderVoucherConsistency.test.js`

- [ ] **Step 1: Write the failing voucher pricing tests**

```js
// backend/tests/voucherPricing.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { calculateVoucherBreakdown } from "../utils/voucherPricing.js";

test("free_shipping only discounts delivery fee", async () => {
  const result = await calculateVoucherBreakdown({
    voucher: {
      discountType: "free_shipping",
      discountValue: 30000,
      minOrderValue: 99000,
      appliesToAllProducts: true,
      appliesToAllUsers: true,
      isActive: true,
    },
    userId: "64f200000000000000000001",
    items: [{ productId: "64f100000000000000000002", categorySlug: "burger", unitPrice: 69000, quantity: 2 }],
    fulfillmentType: "delivery",
    deliveryFee: 30000,
    orderTotal: 168000,
  });

  assert.equal(result.shippingDiscount, 30000);
  assert.equal(result.itemDiscount, 0);
  assert.equal(result.finalTotal, 138000);
});
```

```js
// backend/tests/orderVoucherConsistency.test.js
test("order controller and voucher apply share the same final totals", async () => {
  const result = await calculateVoucherBreakdown({
    voucher: {
      discountType: "percent",
      discountValue: 15,
      maxDiscountAmount: 40000,
      appliesToAllProducts: false,
      categories: [{ slug: "lunch-deals" }],
      appliesToAllUsers: true,
      isActive: true,
    },
    userId: "64f200000000000000000001",
    items: [{ productId: "64f100000000000000000019", categorySlug: "lunch-deals", unitPrice: 89000, quantity: 2 }],
    fulfillmentType: "delivery",
    deliveryFee: 30000,
    orderTotal: 208000,
  });

  assert.equal(result.itemDiscount, 26700);
  assert.equal(result.finalTotal, 181300);
});
```

- [ ] **Step 2: Run the voucher tests to verify they fail**

Run: `node --test tests/voucherPricing.test.js tests/orderVoucherConsistency.test.js`

Expected: FAIL because `calculateVoucherBreakdown` does not exist and the current schema cannot target categories or free shipping.

- [ ] **Step 3: Expand the voucher schema**

```js
// backend/models/Voucher.js
export const EVoucherDiscountType = {
  Percent: "percent",
  Amount: "amount",
  FreeShipping: "free_shipping",
};

categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
```

- [ ] **Step 4: Implement the shared pricing utility and use it from both controllers**

```js
// backend/utils/voucherPricing.js
export const calculateVoucherBreakdown = async ({
  voucher,
  userId,
  items,
  fulfillmentType,
  deliveryFee,
  orderTotal,
}) => {
  const eligibleSubtotal = items
    .filter((item) => item.isEligible !== false)
    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let itemDiscount = 0;
  let shippingDiscount = 0;

  if (voucher.discountType === "free_shipping") {
    if (fulfillmentType !== "delivery") {
      return { errorMessage: "Ma nay chi ap dung cho don giao hang." };
    }
    shippingDiscount = Math.min(deliveryFee, voucher.discountValue || deliveryFee);
  }

  if (voucher.discountType === "percent") {
    itemDiscount = (eligibleSubtotal * voucher.discountValue) / 100;
    if (voucher.maxDiscountAmount > 0) {
      itemDiscount = Math.min(itemDiscount, voucher.maxDiscountAmount);
    }
  }

  if (voucher.discountType === "amount") {
    itemDiscount = Math.min(voucher.discountValue, eligibleSubtotal);
  }

  const discountAmount = itemDiscount + shippingDiscount;
  return {
    eligibleSubtotal,
    itemDiscount,
    shippingDiscount,
    discountAmount,
    finalTotal: Math.max(orderTotal - discountAmount, 0),
  };
};
```

```js
// backend/controllers/voucherController.js
const breakdown = await calculateVoucherBreakdown({
  voucher,
  userId,
  items: eligibleItems,
  fulfillmentType,
  deliveryFee,
  orderTotal,
});
```

```js
// backend/controllers/orderController.js
const voucherResult = await calculateVoucherForItems({
  userId: customerId,
  code: voucherCode,
  items: normalizedItems.map((item) => ({
    productId: item.productId,
    categorySlug: item.categorySlug,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
  })),
  fulfillmentType: fulfillment.fulfillmentType,
  deliveryFee: fulfillment.deliveryFee,
  orderTotal: originalTotalPrice,
});
```

- [ ] **Step 5: Run the voucher tests**

Run: `node --test tests/voucherPricing.test.js tests/orderVoucherConsistency.test.js`

Expected: PASS with percent, amount, and free shipping calculations covered.

- [ ] **Step 6: Commit**

```bash
git add backend/models/Voucher.js backend/utils/voucherPricing.js backend/controllers/voucherController.js backend/controllers/orderController.js backend/routes/voucherRoutes.js backend/tests/voucherPricing.test.js backend/tests/orderVoucherConsistency.test.js
git commit -m "feat(voucher): unify FireBite voucher pricing rules"
```

### Task 5: Sync the Frontend Storefront With the New Backend Contracts

**Files:**
- Create: `IT4409-project-main/frontend/src/api/cartApi.js`
- Create: `IT4409-project-main/frontend/src/utils/cartPayload.js`
- Create: `IT4409-project-main/frontend/src/utils/checkoutPricing.js`
- Modify: `IT4409-project-main/frontend/src/api/productsApi.js`
- Modify: `IT4409-project-main/frontend/src/api/categoriesApi.js`
- Modify: `IT4409-project-main/frontend/src/contexts/CartContext.jsx`
- Modify: `IT4409-project-main/frontend/src/components/filters/FilterSidebar/FilterSidebar.jsx`
- Modify: `IT4409-project-main/frontend/src/pages/ProductListingPage/ProductListingPage.jsx`
- Modify: `IT4409-project-main/frontend/src/pages/ProductDetail/ProductDetailPage.jsx`
- Modify: `IT4409-project-main/frontend/src/components/cart/OrderSummary.jsx`
- Modify: `IT4409-project-main/frontend/src/pages/CheckoutPage.jsx`
- Test: `IT4409-project-main/frontend/tests/productsApi.test.js`
- Test: `IT4409-project-main/frontend/tests/cartPayload.test.js`
- Test: `IT4409-project-main/frontend/tests/checkoutPricing.test.js`
- Test: `IT4409-project-main/frontend/tests/cartItem.test.js`

- [ ] **Step 1: Write the failing frontend contract tests**

```js
// frontend/tests/productsApi.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeProduct } from "../src/api/productsApi.js";

test("normalizeProduct maps backend food fields into storefront shape", () => {
  const normalized = normalizeProduct({
    _id: "64f100000000000000000011",
    name: "Com Ga Sot Tieu Den",
    category: { name: "Com to", slug: "rice-bowls" },
    price: 89000,
    discountPrice: 79000,
    soldCount: 184,
    images: ["https://example.com/com-ga.jpg"],
    specifications: { serving: "1 nguoi", calories: "710 kcal" },
  });

  assert.equal(normalized.category.slug, "rice-bowls");
  assert.equal(normalized.newPrice, 79000);
  assert.equal(normalized.soldCount, 184);
  assert.equal(normalized.image, "https://example.com/com-ga.jpg");
});
```

```js
// frontend/tests/cartPayload.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { buildCartApiItemPayload } from "../src/utils/cartPayload.js";

test("buildCartApiItemPayload sends the food cart shape expected by backend", () => {
  const payload = buildCartApiItemPayload({
    id: "64f100000000000000000002",
    name: "Burger Ga Gion Mat Ong",
    imageUrl: "https://example.com/burger.jpg",
    quantity: 2,
    newPrice: 69000,
    selectedSize: { label: "Double Patty", priceModifier: 22000 },
    selectedAddons: [{ label: "Them pho mai", price: 9000, quantity: 1 }],
    itemNote: "It sot",
    cartKey: "burger::double patty::them pho mai:1:9000::it sot",
  });

  assert.equal(payload.productName, "Burger Ga Gion Mat Ong");
  assert.equal(payload.selectedSize.label, "Double Patty");
  assert.equal(payload.selectedAddons[0].label, "Them pho mai");
});
```

```js
// frontend/tests/checkoutPricing.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { calculateCheckoutTotals } from "../src/utils/checkoutPricing.js";

test("calculateCheckoutTotals uses item and shipping discounts from voucher breakdown", () => {
  const totals = calculateCheckoutTotals({
    items: [{ configuredUnitPrice: 79000, quantity: 2 }],
    fulfillmentType: "delivery",
    voucherResult: {
      itemDiscount: 15000,
      shippingDiscount: 30000,
      discountAmount: 45000,
      finalTotal: 113000,
    },
  });

  assert.equal(totals.subtotal, 158000);
  assert.equal(totals.deliveryFee, 30000);
  assert.equal(totals.discountAmount, 45000);
  assert.equal(totals.total, 113000);
});
```

- [ ] **Step 2: Run the frontend tests to verify they fail**

Run: `node --test tests/productsApi.test.js tests/cartPayload.test.js tests/checkoutPricing.test.js tests/cartItem.test.js`

Expected: FAIL because the exported helpers do not exist and the current order summary does not use the richer voucher breakdown.

- [ ] **Step 3: Extract the pure helpers and export the product normalizer**

```js
// frontend/src/utils/cartPayload.js
export const buildCartApiItemPayload = (item) => ({
  cartKey: item.cartKey,
  productId: item.id,
  productName: item.name,
  productImage: item.imageUrl || item.image || "",
  quantity: item.quantity,
  price: item.newPrice,
  selectedSize: item.selectedSize,
  selectedAddons: item.selectedAddons || [],
  itemNote: item.itemNote || "",
});
```

```js
// frontend/src/utils/checkoutPricing.js
export const calculateCheckoutTotals = ({ items, fulfillmentType, voucherResult }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.configuredUnitPrice || item.newPrice) * item.quantity,
    0
  );
  const deliveryFee = fulfillmentType === "delivery" && subtotal > 0 ? 30000 : 0;
  const discountAmount = voucherResult?.discountAmount || 0;
  const total =
    voucherResult?.finalTotal ?? Math.max(subtotal + deliveryFee - discountAmount, 0);
  return { subtotal, deliveryFee, discountAmount, total };
};
```

```js
// frontend/src/api/productsApi.js
export const normalizeProduct = (product) => ({
  id: product._id || product.id,
  _id: product._id || product.id,
  name: product.name,
  slug: product.slug || "",
  description: product.description || "",
  category: {
    name: product.category?.name || "",
    slug: product.category?.slug || "",
  },
  price: product.price ?? 0,
  discountPrice: product.discountPrice ?? product.price ?? 0,
  newPrice: product.discountPrice ?? product.price ?? 0,
  originalPrice: product.price ?? 0,
  soldCount: product.soldCount ?? 0,
  image: product.images?.[0] || "",
  images: product.images || [],
  specifications: product.specifications || {},
  sizes: product.sizes || [],
  addons: product.addons || [],
  comboItems: product.comboItems || [],
  badges: product.badges || [],
  highlights: product.highlights || [],
  isAvailable: product.isAvailable ?? true,
});
```

- [ ] **Step 4: Wire product detail, listing, and cart sync to the backend**

```js
// frontend/src/api/cartApi.js
export const fetchCart = async (token) =>
  axios.get(buildApiUrl("/cart"), { headers: { Authorization: `Bearer ${token}` } });

export const addCartItem = async (token, payload) =>
  axios.post(buildApiUrl("/cart/items"), payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
```

```js
// frontend/src/contexts/CartContext.jsx
const token = localStorage.getItem("token");
if (token) {
  await addCartItem(token, buildCartApiItemPayload(nextItem));
}
```

```js
// frontend/src/pages/ProductDetail/ProductDetailPage.jsx
const response = await axios.get(buildApiUrl(`/products/${id}`));
setProduct(normalizeProduct(response.data));
```

```js
// frontend/src/components/cart/OrderSummary.jsx
const totals = calculateCheckoutTotals({
  items: cartItems,
  fulfillmentType,
  voucherResult,
});
```

- [ ] **Step 5: Remove the dead electronics storefront files**

```bash
git rm IT4409-project-main/frontend/src/data/filterConfigs.js
git rm IT4409-project-main/frontend/src/components/filters/FilterSidebar/BrandFilter.jsx
git rm IT4409-project-main/frontend/src/components/ProductDetail/ProductGallery/ProductGallery.jsx
git rm IT4409-project-main/frontend/src/components/ProductDetail/ProductGallery/ProductGallery.css
git rm IT4409-project-main/frontend/src/components/ProductDetail/ProductGallery/index.js
git rm IT4409-project-main/frontend/src/components/ProductDetail/ProductInfo/ProductInfo.jsx
git rm IT4409-project-main/frontend/src/components/ProductDetail/ProductInfo/ProductInfo.css
git rm IT4409-project-main/frontend/src/components/ProductDetail/ProductInfo/index.js
git rm IT4409-project-main/frontend/src/components/ProductDetail/ReviewsSection/ReviewsSection.jsx
git rm IT4409-project-main/frontend/src/components/ProductDetail/ReviewsSection/ReviewsSection.css
git rm IT4409-project-main/frontend/src/components/ProductDetail/ReviewsSection/index.js
git rm IT4409-project-main/frontend/src/components/ProductDetail/SpecificationsTable/SpecificationsTable.jsx
git rm IT4409-project-main/frontend/src/components/ProductDetail/SpecificationsTable/SpecificationsTable.css
git rm IT4409-project-main/frontend/src/components/ProductDetail/SpecificationsTable/index.js
git rm IT4409-project-main/frontend/src/components/ProductDetail/VariantSelector/VariantSelector.jsx
git rm IT4409-project-main/frontend/src/components/ProductDetail/VariantSelector/VariantSelector.css
git rm IT4409-project-main/frontend/src/components/ProductDetail/VariantSelector/index.js
git rm IT4409-project-main/frontend/src/assets/AKKO.webp
git rm "IT4409-project-main/frontend/src/assets/Balo .jfif"
git rm "IT4409-project-main/frontend/src/assets/Bàn phím.jfif"
git rm "IT4409-project-main/frontend/src/assets/Chuột.webp"
git rm IT4409-project-main/frontend/src/assets/Lenovo.webp
git rm IT4409-project-main/frontend/src/assets/LenovoLOQ.jfif
git rm "IT4409-project-main/frontend/src/assets/chuột logitech G102.jpg"
git rm IT4409-project-main/frontend/src/assets/laptop.webp
```

- [ ] **Step 6: Run the frontend verification**

Run: `node --test tests/productsApi.test.js tests/cartPayload.test.js tests/checkoutPricing.test.js tests/cartItem.test.js`

Run: `npm run build`

Expected: tests PASS and Vite build exits `0`.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/api/cartApi.js frontend/src/utils/cartPayload.js frontend/src/utils/checkoutPricing.js frontend/src/api/productsApi.js frontend/src/api/categoriesApi.js frontend/src/contexts/CartContext.jsx frontend/src/components/filters/FilterSidebar/FilterSidebar.jsx frontend/src/pages/ProductListingPage/ProductListingPage.jsx frontend/src/pages/ProductDetail/ProductDetailPage.jsx frontend/src/components/cart/OrderSummary.jsx frontend/src/pages/CheckoutPage.jsx frontend/tests/productsApi.test.js frontend/tests/cartPayload.test.js frontend/tests/checkoutPricing.test.js frontend/tests/cartItem.test.js
git commit -m "feat(frontend): sync FireBite storefront with backend contracts"
```

### Task 6: Polish Admin Menu and Voucher Tools, Then Remove Dead Admin Files

**Files:**
- Modify: `IT4409-project-main/frontend/src/components/admin/AdminProducts.jsx`
- Modify: `IT4409-project-main/frontend/src/components/admin/AdminVouchers.jsx`
- Modify: `IT4409-project-main/frontend/src/components/admin/utils.js`
- Delete: `IT4409-project-main/frontend/src/components/admin/ProductForm.jsx`
- Delete: `IT4409-project-main/frontend/src/pages/admin/AdminProductPage.jsx`
- Delete: `IT4409-project-main/frontend/src/pages/admin/AdminOverviewPage.jsx`
- Test: `IT4409-project-main/frontend/tests/adminUtils.test.js`

- [ ] **Step 1: Write the failing admin helper tests**

```js
// frontend/tests/adminUtils.test.js
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAdminProductPayload,
  describeVoucherScope,
} from "../src/components/admin/utils.js";

test("buildAdminProductPayload serializes FireBite menu form values", () => {
  const payload = buildAdminProductPayload({
    name: "Combo trua ga gion",
    category: "lunch-deals",
    itemType: "combo",
    price: "109000",
    discountPrice: "99000",
    stock: "20",
    soldCount: "140",
    preparationTime: "12",
    spiceLevel: "mild",
    sizes: [{ label: "Regular", priceModifier: "0", isDefault: true }],
    addons: [{ label: "Them pepsi", price: "15000", maxQuantity: "2", isAvailable: true }],
    comboItemsText: "1 burger\n1 pepsi",
    badgesText: "lunch, best_seller",
    highlightsText: "Phuc vu gio trua",
    isAvailable: true,
    isActive: true,
    isBestSeller: true,
    isNew: false,
    imageFiles: [],
  });

  assert.equal(payload.get("name"), "Combo trua ga gion");
  assert.equal(payload.get("category"), "lunch-deals");
  assert.equal(payload.get("soldCount"), "140");
});

test("describeVoucherScope summarizes category and product targeting", () => {
  assert.equal(
    describeVoucherScope({
      appliesToAllProducts: false,
      products: [{ _id: "1" }, { _id: "2" }],
      categories: [{ _id: "10" }],
    }),
    "2 mon | 1 danh muc"
  );
});
```

- [ ] **Step 2: Run the admin tests to verify they fail**

Run: `node --test tests/adminUtils.test.js`

Expected: FAIL because the helper exports do not exist.

- [ ] **Step 3: Extract admin serializers and scope labels into `utils.js`**

```js
// frontend/src/components/admin/utils.js
export const buildAdminProductPayload = (formState) => {
  const payload = new FormData();
  payload.append("name", formState.name.trim());
  payload.append("slug", formState.slug.trim());
  payload.append("category", formState.category);
  payload.append("itemType", formState.itemType);
  payload.append("description", formState.description.trim());
  payload.append("price", String(Number(formState.price || 0)));
  payload.append("discountPrice", formState.discountPrice === "" ? "" : String(Number(formState.discountPrice)));
  payload.append("stock", String(Number(formState.stock || 0)));
  payload.append("soldCount", String(Number(formState.soldCount || 0)));
  payload.append("preparationTime", String(Number(formState.preparationTime || 15)));
  payload.append("spiceLevel", formState.spiceLevel);
  payload.append("sizes", JSON.stringify(sanitizeSizes(formState.sizes)));
  payload.append("addons", JSON.stringify(sanitizeAddons(formState.addons)));
  payload.append("comboItems", JSON.stringify(splitTextLines(formState.comboItemsText)));
  payload.append("badges", JSON.stringify(splitTags(formState.badgesText)));
  payload.append("highlights", JSON.stringify(splitTextLines(formState.highlightsText)));
  payload.append("isAvailable", String(formState.isAvailable));
  payload.append("isActive", String(formState.isActive));
  payload.append("isBestSeller", String(formState.isBestSeller));
  payload.append("isNew", String(formState.isNew));
  return payload;
};

export const describeVoucherScope = (voucher) => {
  if (voucher.appliesToAllProducts) return "Toan bo menu";
  const productCount = voucher.products?.length || 0;
  const categoryCount = voucher.categories?.length || 0;
  return `${productCount} mon | ${categoryCount} danh muc`;
};
```

- [ ] **Step 4: Wire the admin pages to the new helpers and add category targeting to vouchers**

```js
// frontend/src/components/admin/AdminProducts.jsx
const payload = buildAdminProductPayload(formState);
```

```js
// frontend/src/components/admin/AdminVouchers.jsx
<button type="button" onClick={openCategoryModal}>
  Chon danh muc
</button>

<div className="mt-1 text-sm font-medium text-slate-700">
  {describeVoucherScope(voucher)}
</div>
```

- [ ] **Step 5: Delete the dead admin files**

```bash
git rm IT4409-project-main/frontend/src/components/admin/ProductForm.jsx
git rm IT4409-project-main/frontend/src/pages/admin/AdminProductPage.jsx
git rm IT4409-project-main/frontend/src/pages/admin/AdminOverviewPage.jsx
```

- [ ] **Step 6: Run the admin helper tests and final frontend build**

Run: `node --test tests/adminUtils.test.js`

Run: `npm run build`

Expected: both commands succeed.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/admin/AdminProducts.jsx frontend/src/components/admin/AdminVouchers.jsx frontend/src/components/admin/utils.js frontend/tests/adminUtils.test.js
git commit -m "refactor(admin): align FireBite admin tools with menu domain"
```

### Task 7: End-to-End Verification, Seed Reset, and Cleanup Pass

**Files:**
- Modify: `IT4409-project-main/backend/scripts/seedFoodCatalog.js`
- Modify: `IT4409-project-main/frontend/src/contexts/CartContext.jsx`
- Test: `IT4409-project-main/backend/tests/menuDomain.test.js`
- Test: `IT4409-project-main/backend/tests/productQuery.test.js`
- Test: `IT4409-project-main/backend/tests/cartDomain.test.js`
- Test: `IT4409-project-main/backend/tests/voucherPricing.test.js`
- Test: `IT4409-project-main/backend/tests/orderVoucherConsistency.test.js`
- Test: `IT4409-project-main/frontend/tests/menuData.test.js`
- Test: `IT4409-project-main/frontend/tests/productsApi.test.js`
- Test: `IT4409-project-main/frontend/tests/cartPayload.test.js`
- Test: `IT4409-project-main/frontend/tests/checkoutPricing.test.js`
- Test: `IT4409-project-main/frontend/tests/adminUtils.test.js`
- Test: `IT4409-project-main/frontend/tests/cartItem.test.js`

- [ ] **Step 1: Add final seed commands and destructive reset note to the backend script output**

```js
// backend/scripts/seedFoodCatalog.js
console.log("Seeded FireBite categories, menu items, and demo vouchers.");
console.log("Use `npm run seed:food -- --clean-related` to clear carts, reviews, and orders for a clean demo.");
```

- [ ] **Step 2: Run the full backend test suite**

Run: `node --test tests/menuDomain.test.js tests/productQuery.test.js tests/cartDomain.test.js tests/voucherPricing.test.js tests/orderVoucherConsistency.test.js`

Expected: PASS.

- [ ] **Step 3: Run the full frontend test suite**

Run: `node --test tests/menuData.test.js tests/productsApi.test.js tests/cartPayload.test.js tests/checkoutPricing.test.js tests/adminUtils.test.js tests/cartItem.test.js`

Expected: PASS.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: Vite build succeeds with exit code `0`.

- [ ] **Step 5: Smoke-test the runtime flows manually**

Run:

```bash
# terminal 1
cd IT4409-project-main/backend
npm run seed:food -- --clean-related
npm run dev

# terminal 2
cd IT4409-project-main/frontend
npm run dev
```

Manual checklist:

1. Dang ky va dang nhap thanh cong.
2. Homepage hien menu FireBite, khong con data dien tu.
3. Listing filter theo category, item type, spice level hoat dong.
4. Trang chi tiet fetch `GET /api/products/:id` va cho chon size/add-on.
5. Gio hang backend cap nhat dung khi them, sua so luong, xoa mon.
6. Voucher percent, amount, free shipping hien breakdown dung.
7. Tao order `delivery`, `pickup`, `dine_in` thanh cong.
8. Admin tao voucher target theo category va mon.

- [ ] **Step 6: Commit the verification and cleanup pass**

```bash
git add backend/scripts/seedFoodCatalog.js
git commit -m "chore: verify FireBite food platform end-to-end"
```

## Self-Review

### Spec coverage

- Catalog mo rong va realistic data: Task 3
- Cleanup domain dien tu: Task 1, Task 5, Task 6
- Dong bo backend/frontend cho product/cart/order: Task 1, Task 2, Task 5
- Voucher rules day du: Task 4, Task 6
- Seed data va verification: Task 3, Task 7

Khong thay khoang trong nao so voi spec da duyet.

### Placeholder scan

- Khong dung placeholder mo ho, khong co buoc bo trong
- Moi task deu co file, code snippet, command, expected fail/pass va commit

### Type consistency

- Product runtime shape dung `category.slug`, `soldCount`, `sizes`, `addons`, `specifications`
- Cart/order item shape dung `selectedSize`, `selectedAddons`, `itemNote`, `unitPrice`, `lineTotal`
- Voucher breakdown dung `itemDiscount`, `shippingDiscount`, `discountAmount`, `finalTotal`

Ten field duoc giu nhat quan xuyen suot ke hoach.
