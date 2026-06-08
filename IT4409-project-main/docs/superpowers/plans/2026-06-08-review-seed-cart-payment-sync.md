# Review Seed and Cart Payment Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seed exactly 300 varied reviews and synchronize authenticated carts only after successful COD or ZaloPay outcomes.

**Architecture:** Add pure quantity-aware cart consumption helpers, persist cart snapshots on order items, and let order/payment controllers invoke one idempotent server-side cleanup function. The frontend stops optimistic ZaloPay deletion and reloads the server cart after confirmed success. The existing catalog seed generates deterministic review and user data and recalculates product aggregates.

**Tech Stack:** Node.js, Express, Mongoose, React, Axios, Node test runner

---

### Task 1: Quantity-Aware Purchased Cart Cleanup

**Files:**
- Modify: `backend/utils/cartDomain.js`
- Test: `backend/tests/cartDomain.test.js`

- [x] **Step 1: Write failing tests**

Add tests proving purchased quantities are subtracted, unchanged lines remain,
and repeated cleanup can be guarded by order state.

- [x] **Step 2: Verify tests fail**

Run: `node --test tests/cartDomain.test.js`

Expected: failure because `consumePurchasedCartItems` does not exist.

- [x] **Step 3: Implement the pure helper**

Match items by normalized `cartKey`; remove a line when purchased quantity is at
least its current quantity, otherwise decrement quantity and recalculate
`lineTotal`.

- [x] **Step 4: Verify tests pass**

Run: `node --test tests/cartDomain.test.js`

Expected: all cart domain tests pass.

### Task 2: Server-Owned Order Cart Synchronization

**Files:**
- Modify: `backend/models/Order.js`
- Modify: `backend/utils/orderPricing.js`
- Create: `backend/services/orderCartSync.js`
- Modify: `backend/controllers/orderController.js`
- Modify: `backend/controllers/paymentController.js`
- Test: `backend/tests/orderCartSync.test.js`

- [x] **Step 1: Write failing synchronization tests**

Cover missing carts, quantity subtraction, and the `cartItemsConsumed` idempotency
flag.

- [x] **Step 2: Verify tests fail**

Run: `node --test tests/orderCartSync.test.js`

Expected: failure because the synchronization service does not exist.

- [x] **Step 3: Persist cart snapshots and implement synchronization**

Store `cartKey` on order items and `cartItemsConsumed` on orders. The service
loads the user's cart, consumes the order snapshot once, saves the cart, marks
the order consumed, and saves the order.

- [x] **Step 4: Wire payment outcomes**

Call synchronization after successful COD order creation and from the shared
ZaloPay `markOrderPaid` path. Do not call it for waiting or failed payments.

- [x] **Step 5: Verify synchronization tests**

Run: `node --test tests/orderCartSync.test.js tests/cartDomain.test.js`

Expected: all tests pass.

### Task 3: Frontend Cart Refresh

**Files:**
- Modify: `frontend/src/utils/cartPayload.js`
- Modify: `frontend/src/contexts/CartContext.jsx`

- [x] **Step 1: Include `cartKey` in order payloads**

Ensure order items sent by checkout retain their exact configured cart identity.

- [x] **Step 2: Remove optimistic ZaloPay deletion**

Keep cart items while redirecting. Store the pending order and poll status.

- [x] **Step 3: Refresh from backend after confirmed success**

After COD creation or a paid ZaloPay status response, call `fetchCart` and apply
the server response. Preserve cart state on waiting and failure.

- [x] **Step 4: Run frontend checks**

Run: `npm run lint`

Expected: zero lint errors.

### Task 4: Generate 300 Reviews

**Files:**
- Modify: `backend/scripts/seedFoodCatalog.js`

- [x] **Step 1: Add deterministic reviewer and review generation**

Create reusable demo customers, distribute 300 reviews across products, vary
ratings/comments/dates, and avoid duplicate user/product pairs.

- [x] **Step 2: Recalculate product aggregates**

Aggregate reviews by product and update `rating` plus `numReviews`.

- [x] **Step 3: Run the configured Atlas seed**

Run: `npm run seed:food`

Expected: output reports exactly 300 reviews.

- [x] **Step 4: Verify database counts**

Query MongoDB through the project connection and confirm 300 reviews plus
matching product aggregates.

### Task 5: Full Verification

**Files:**
- Verify only

- [x] **Step 1: Run backend tests**

Run: `npm test`

Expected: all tests pass.

- [x] **Step 2: Run frontend lint and build**

Run: `npm run lint`

Run: `npm run build -- --outDir .verification-build --emptyOutDir`

Expected: both commands exit successfully.

- [x] **Step 3: Inspect Git diff and remove temporary build output**

Confirm only planned source, test, and documentation files changed.
