# FireBite Model Notes

Tai lieu nay mo ta cac model runtime hien tai cua backend FireBite. Domain san pham dien tu cu da duoc loai khoi luong chinh.

## Product

`Product` dai dien cho mot menu item.

Field chinh:
- `name`, `slug`, `description`
- `category`
- `price`, `discountPrice`
- `stock`, `soldCount`
- `images`
- `itemType`
- `preparationTime`, `spiceLevel`
- `sizes[]`, `addons[]`, `comboItems[]`
- `badges[]`, `highlights[]`
- `specifications`
- `isAvailable`, `isActive`, `isBestSeller`, `isNew`

`specifications` hien chi dung cho thong tin mon an nhu:
- `serving`
- `portion`
- `calories`
- `ingredients`
- `allergens`
- `items`
- `sugar`
- `protein`
- `caffeine`
- `spiceLevel`

## Category

`Category` luu danh muc menu va icon hien thi.

Danh muc mac dinh:
- `burger`
- `fried-chicken`
- `rice-bowls`
- `pasta-wraps`
- `sides-snacks`
- `soups-salads`
- `desserts`
- `drinks`
- `combo`
- `group-meals`
- `lunch-deals`

## Cart

`Cart` luu snapshot mon da cau hinh cua tung user.

Moi item gom:
- `cartKey`
- `productId`, `productName`, `productImage`
- `quantity`
- `selectedSize`
- `selectedAddons`
- `itemNote`
- `basePrice`
- `unitPrice`
- `lineTotal`

Backend cart API:
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:cartKey`
- `DELETE /api/cart/items/:cartKey`

## Order

`Order` luu don mon da chot.

Don hang ho tro 3 kieu nhan mon:
- `delivery`
- `pickup`
- `dine_in`

Moi item trong order la snapshot menu item da chon size/add-on:
- `productId`
- `productName`
- `productImage`
- `quantity`
- `selectedSize`
- `selectedAddons`
- `itemNote`
- `basePrice`
- `unitPrice`
- `lineTotal`

Gia tri tong hop chinh:
- `itemsPrice`
- `deliveryFee`
- `discountAmount`
- `finalTotalPrice`

## Voucher

`Voucher` ho tro:
- `percent`
- `amount`
- `free_shipping`

Dieu kien va pham vi:
- `minOrderValue`
- `maxUsage`, `usedCount`
- `startDate`, `endDate`
- `isActive`
- `appliesToAllUsers`, `users[]`
- `appliesToAllProducts`, `products[]`, `categories[]`

Voucher duoc tinh boi `backend/utils/voucherPricing.js`, dung chung cho:
- `POST /api/vouchers/apply`
- `POST /api/orders`

Breakdown tra ve:
- `eligibleSubtotal`
- `itemDiscount`
- `shippingDiscount`
- `discountAmount`
- `finalTotal`

## Seed

Catalog demo duoc seed boi:
- `backend/scripts/seedFoodCatalog.js`

Script nay dung chung data voi frontend:
- `frontend/src/data/categories.js`
- `frontend/src/data/menuData.js`
