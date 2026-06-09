# FireBite Frontend

Vite React storefront and admin portal for FireBite.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Default API target is `http://localhost:5000/api`. Override with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RECAPTCHA_SITE_KEY=
VITE_GOOGLE_CLIENT_ID=
VITE_USE_DATABASE_ONLY=false
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- Login sends a reCAPTCHA v3 token when `VITE_RECAPTCHA_SITE_KEY` is configured.
- Admin users are routed to `/admin` after login.
- ZaloPay orders are verified through backend status/callback; the frontend no longer calls a manual confirm endpoint.
