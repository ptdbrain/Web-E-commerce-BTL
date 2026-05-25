# FireBite MiniShopee

Full-stack food ordering app with a separate admin portal for menu, category, voucher, order, and customer support workflows.

## Structure

- `backend`: Express, MongoDB, Redis optional, ZaloPay integration, admin APIs.
- `frontend`: React/Vite storefront and `/admin` portal.
- `docs`: supporting project documentation.

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Fill required values: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
3. Optional production values: `RECAPTCHA_SECRET`, `REDIS_URL`, Cloudinary, ZaloPay keys.
4. Run:

```bash
cd backend
npm install
npm run dev
```

Useful backend checks:

```bash
npm test
```

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Set `VITE_API_BASE_URL` to the backend `/api` URL.
3. Run:

```bash
cd frontend
npm install
npm run dev
```

Production builds use database data only by default. Local development can still use fallback menu data unless `VITE_USE_DATABASE_ONLY=true`.

Useful frontend checks:

```bash
npm run lint
npm run build
```

## Admin Portal

Admin users are routed to `/admin` after login. Current admin modules:

- Dashboard and store metrics.
- Orders: kitchen workflow, delivery/pickup/dine-in status handling, payment status.
- Menu: create/update items, stock, price, options, soft-hide from storefront.
- Categories: create/update category metadata and soft-hide categories.
- Vouchers: create/update/toggle/delete promotions with user/product/category targeting.
- Chat: reply to order questions and see unread customer messages.
