# FireBite Food Platform Design

**Date:** 2026-04-23

## Goal

Chuyen doi repo hien tai thanh he thong web/app ban do an theo mo hinh mot cua hang FireBite, giu lai khung du an frontend/backend san co nhung cat sach domain do dien tu khoi luong van hanh chinh. He thong sau khi chuyen doi phai co catalog mon an thuc te, cart va checkout dong bo voi backend, order flow nhat quan, va voucher du nghiep vu do an.

## Product Direction

- Thuong hieu giu nguyen: `FireBite`
- Dinh vi: fast-food mo rong menu
- Gom menu chinh:
  - burger
  - fried-chicken
  - rice-bowls
  - pasta-wraps
  - sides-snacks
  - soups-salads
  - desserts
  - drinks
  - combo
  - group-meals
  - lunch-deals

## Non-Goals

- Khong doi repo thanh marketplace nhieu cua hang
- Khong xay he thong bep thoi gian thuc
- Khong them ban do giao hang hoac tinh khoang cach
- Khong doi toan bo kien truc route/page hien tai neu co the sua tren khung san co

## Current-State Findings

### What already aligns

- Frontend da co huong rebrand FireBite cho homepage, listing, detail, checkout va admin.
- Backend da co `Product`, `Order`, `Voucher`, auth, review, payment, admin routes.
- Order flow da co `delivery`, `pickup`, `dine_in`.
- Voucher flow da co `apply` va `create order`.

### What is still inconsistent

- Backend van con domain cu: `Brand`, `brand`, `warranty`, `origin`, script tao brand/category, README va mot so search/filter logic theo do dien tu.
- Frontend van con mot so component, asset va wording domain cu: `BrandFilter`, `SpecificationsTable`, asset laptop/chuot/ban phim, mot so text/comment con noi theo "san pham dien tu".
- Trang chi tiet mon an hien fetch bang `getProductById` tu cache `GET /products` thay vi co endpoint `GET /products/:id`.
- Cart hien tai van la local state/localStorage; backend co `Cart` model nhung schema dang la variant dien tu va chua co cart API.
- Voucher schema hien chua ho tro `free_shipping` va target theo category.

## Target Domain Model

### Product becomes menu item

`Product` giu ten model de tranh pha vo cau truc repo, nhung nghia nghiep vu la `menu item`.

#### Required fields kept or standardized

- `name`
- `slug`
- `description`
- `price`
- `discountPrice`
- `stock`
- `category`
- `itemType`
- `images`
- `sizes`
- `addons`
- `comboItems`
- `badges`
- `highlights`
- `preparationTime`
- `spiceLevel`
- `rating`
- `numReviews`
- `isAvailable`
- `isActive`
- `isBestSeller`
- `isNew`

#### New or normalized food-centric fields

- `soldCount`
- `specifications` with food meaning only:
  - `serving`
  - `portion`
  - `calories`
  - `ingredients`
  - `allergens`
  - `spiceLevel`
  - `temperature`

#### Fields removed from active domain

- `brand`
- `warranty`
- `origin`
- `variants` in electronics meaning

### Category model

`Category` tiep tuc duoc giu, nhung seed va UI chi dung category do an. Danh sach seed phai dong bo voi menu FireBite mo rong.

### Cart model

`Cart` duoc chuyen tu schema variant dien tu sang schema mon an co cau hinh:

- `userId`
- `items[]`
  - `cartKey`
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

`cartKey` la khoa on dinh duoc sinh tu product + size + addons + note, giong cach frontend dang gom item.

### Order model

`Order` giu khung hien tai, tiep tuc luu snapshot item thay vi tham chieu dong:

- `productId`
- `productName`
- `productImage`
- `quantity`
- `selectedSize`
- `selectedAddons`
- `itemNote`
- `price`
- `unitPrice`
- `lineTotal`

Order tiep tuc ho tro:

- `fulfillmentType`: `delivery`, `pickup`, `dine_in`
- `shippingAddress`
- `pickupTime`
- `tableBooking`
- `paymentMethod`
- `orderStatus`
- `deliveryFee`
- `originalTotalPrice`
- `discountAmount`
- `voucherCode`
- `voucherId`
- `totalPrice`

### Voucher model

Voucher duoc mo rong de ho tro nghiep vu do an:

- `discountType`: `percent`, `amount`, `free_shipping`
- `discountValue`
- `maxDiscountAmount`
- `minOrderValue`
- `maxUsage`
- `usedCount`
- `startDate`
- `endDate`
- `isActive`
- `appliesToAllUsers`
- `appliesToAllProducts`
- `users[]`
- `products[]`
- `categories[]`

`categories[]` la bo sung can thiet de ap dung voucher theo nhom mon.

## Catalog Strategy

### Catalog volume

Catalog mau se nang len khoang 28-36 mon, chia deu giua:

- mon chinh
- mon an nhanh
- mon nuoc/mon nhe
- trang mieng
- do uong
- combo ca nhan va combo nhom

### Catalog consistency

Fallback data frontend va seed backend phai cung mot nguon noi dung va mot field contract. Muc tieu la:

- neu backend chay, frontend hien dung menu backend
- neu backend loi, fallback van la catalog do an FireBite cung shape du lieu
- khong con tinh trang UI FireBite nhung DB van la laptop/VR

### Seed assets

Asset do an uu tien URL anh mon an thuc te. Asset dien tu khong con duoc giu trong flow active.

## Backend API Design

### Existing routes to keep

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/products/featured`
- `GET /api/products/bestsellers`
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders`
- order status routes hien co
- auth routes hien co
- review routes hien co
- voucher routes hien co

### Backend routes to add

- `GET /api/products/:id`
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:cartKey`
- `DELETE /api/cart/items/:cartKey`

### Product query contract

`GET /api/products` se ho tro query ro rang cho frontend:

- `search`
- `category`
- `itemType`
- `spiceLevel`
- `available`
- `featured`

Frontend khong tu viet logic lech contract; listing va search deu dua tren cung naming nay.

### Routes to remove from active system

- bo mount `brandsRoutes` trong `server.js`
- bo search/filter/create/update logic theo `brand`

Route file co the con ton tai tam thoi trong repo neu can de tranh xao tron lich su, nhung khong duoc nam trong duong di van hanh.

## Frontend Design

### Product listing

Menu listing se dung category do an va filter do an:

- loai mon
- do cay
- khoang gia
- con phuc vu
- mon noi bat

Brand filter bi loai bo.

### Product detail

Trang chi tiet mon phai:

- fetch theo `GET /products/:id`
- hien size, addons, item note
- hien combo items neu la combo
- hien thong tin mon tu `specifications` voi nghia do an
- khong con wording "thong so ky thuat" theo nghia dien tu

### Cart behavior

Khi user da dang nhap:

- cart state dong bo voi backend cart API
- cap nhat so luong, xoa mon, them mon deu goi backend

Khi user chua dang nhap:

- cho phep local cart fallback neu can
- nhung shape du lieu van phai trung voi backend cart item

### Checkout behavior

Checkout tiep tuc ho tro:

- delivery
- pickup
- dine_in

Payload gui order phai dung cung shape item ma backend `normalizeOrderItem` xu ly. Backend la noi tinh gia cuoi, unit price va voucher.

### Admin behavior

Admin menu:

- quan ly mon theo category do an
- tao/sua sizes
- tao/sua addons
- tao/sua combo items
- cap nhat tinh trang con phuc vu

Admin voucher:

- tao voucher giam %
- tao voucher giam tien
- tao voucher free shipping
- target theo user, product, category, all menu
- cau hinh min order, max usage, date range

## Voucher Rules

### Validation order

Voucher duoc validate theo thu tu:

1. ton tai va dang active
2. chua qua `maxUsage`
3. da den `startDate`
4. chua qua `endDate`
5. user duoc phep dung neu voucher target user
6. dat `minOrderValue`
7. co item hop le theo `products[]`, `categories[]`, hoac toan menu
8. neu `free_shipping` thi chi ap dung cho `delivery`

### Calculation rules

- `percent`: giam theo subtotal hop le, co tran `maxDiscountAmount` neu co
- `amount`: giam so tien co dinh, khong vuot subtotal hop le
- `free_shipping`: tru vao `deliveryFee`, pickup/dine_in khong duoc ap

### Shared calculation source

Logic tinh voucher phai duoc dung chung giua:

- `POST /api/vouchers/apply`
- `POST /api/orders`

Khong cho phep checkout hien thi mot tong tien va create order tinh ra tong tien khac.

### Checkout response breakdown

Frontend can nhan duoc breakdown ro rang:

- `eligibleSubtotal`
- `itemDiscount`
- `shippingDiscount`
- `discountAmount`
- `finalTotal`

## Cleanup Plan

### Backend cleanup

- xoa `Brand` khoi flow active
- bo `brand` index/query/populate trong product flow
- bo `warranty`, `origin`, `selectedVariant`
- cap nhat scripts seed theo domain do an
- cap nhat README/model docs neu noi dung sai domain

### Frontend cleanup

- bo `BrandFilter`
- bo `SpecificationsTable` neu khong con su dung
- bo `ProductInfo` neu khong con duoc route active su dung
- bo asset dien tu khong con duoc import
- doi text/comment/import thua/file chet sang domain do an

### Cleanup principle

Uu tien cat bo khoi active runtime truoc, sau do don file chet. Khong refactor ngoai pham vi neu khong phuc vu truc tiep cho domain do an.

## Validation And Error Handling

### Product and cart

- Reject product payload neu thieu `name`, `price`, `category`
- Reject cart/order item neu `productId` khong hop le
- Reject `delivery` order neu thieu dia chi
- Reject `pickup` order neu thieu `pickupTime`
- Reject `dine_in` order neu thieu `guestCount` hoac `bookingTime`

### Voucher

Frontend va backend can hien thong bao cu the:

- voucher khong ton tai
- voucher chua bat dau
- voucher da het han
- voucher het luot dung
- khong du dieu kien don toi thieu
- khong ap dung cho mon trong gio
- free shipping khong hop le voi pickup/dine_in

## Testing Strategy

### Backend tests

Bo sung test cho:

- menu product normalization
- cart item normalization
- voucher validation:
  - valid percent
  - valid amount
  - valid free shipping
  - expired
  - not started
  - max usage exceeded
  - min order not met
  - category targeted
  - product targeted
  - free shipping rejected for pickup/dine_in
- order creation uses same voucher outcome as apply voucher

### Frontend tests

Bo sung test cho:

- cart key stability
- configured unit price calculation
- checkout voucher summary rendering
- product normalization from backend response

### Manual verification

Can verify thu cong luong sau:

1. login/register
2. list menu
3. search/filter theo category
4. xem chi tiet mon
5. them vao gio va cap nhat so luong
6. apply voucher
7. dat order delivery/pickup/dine_in
8. admin tao voucher va quan ly trang thai don

## Delivery Sequence

Implementation se di theo thu tu:

1. data model va seed catalog
2. backend cleanup va product/cart/order contract
3. voucher schema + calculation service + routes
4. frontend cleanup + cart sync + checkout sync
5. admin voucher/menu polish
6. verification va seed demo

## Risks

- Repo hien co nhieu file untracked/zip/node_modules trong root; can stage co chu dich de tranh day len git file rac.
- DB cu co the van chua data dien tu; can reseed catalog de UI va backend khop nhau.
- Cart migration tu local-only sang backend-sync de anh huong user state; can co fallback ro rang.

## Success Criteria

He thong duoc coi la dat muc tieu khi:

- khong con route/UI/logic active nao phu thuoc domain dien tu
- catalog FireBite hien thi nhat quan o homepage, listing, detail, admin
- frontend va backend dung chung field names cho product/cart/order/voucher
- voucher tinh chinh xac o ca `apply` va `create order`
- cart, checkout, order flow chay nhat quan tu frontend den backend
