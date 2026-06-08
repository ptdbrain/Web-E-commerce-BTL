# Review Seed and Cart Payment Sync Design

## Goal

Create 300 varied review records and make the server-side cart remain consistent
with successful COD and ZaloPay orders.

## Review Data

- Extend the existing food catalog seed instead of introducing a separate data
  source.
- Create enough deterministic demo customer accounts to allow varied reviewers.
- Generate exactly 300 reviews across all seeded products with ratings from 1
  through 5, varied Vietnamese comments, verified flags, and dates spread over
  recent months.
- Re-running the full seed remains deterministic because the seed already clears
  related collections before inserting catalog and operational data.
- Recalculate each product's `rating` and `numReviews` from inserted reviews.

## Cart and Payment Synchronization

- The backend is the source of truth for authenticated carts.
- Order items store the originating `cartKey` alongside the ordered quantity.
- COD removes or decrements purchased cart quantities only after the order has
  been created successfully.
- ZaloPay keeps the cart unchanged while payment is waiting or failed.
- ZaloPay removes or decrements purchased cart quantities only after callback or
  status polling confirms payment as paid.
- Cleanup is idempotent. An order records whether its purchased cart snapshot was
  already applied, so repeated callbacks cannot remove additional quantities.
- If a customer adds more quantity to the same cart line while ZaloPay is
  pending, successful payment subtracts only the quantity captured by the order.

## Frontend Behavior

- COD refreshes the cart returned by the backend after successful order creation.
- ZaloPay does not clear cart state when redirecting to the provider.
- Once polling reports `paid`, the frontend fetches the authoritative cart and
  updates local state.
- Failed or still-processing payments preserve the cart.

## Verification

- Unit tests cover quantity-aware cart consumption and idempotent cleanup state.
- Existing backend tests, frontend lint, and frontend production build must pass.
- The seed command must report exactly 300 reviews and product rating aggregates
  must match the review collection.

