# Checkout Contact Options Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prefill checkout from the authenticated profile and support order-specific recipient details.

**Architecture:** A pure utility maps the user model to checkout fields and determines profile completeness. `CheckoutPage` owns profile loading and contact mode, while `CheckoutForm` renders the mode selector, profile summary, fallback state, and custom fields.

**Tech Stack:** React, Axios, Tailwind CSS, Node test runner

---

### Task 1: Profile Mapping

**Files:**
- Create: `frontend/src/utils/checkoutContact.js`
- Create: `frontend/src/utils/checkoutContact.test.js`

- [x] Write failing tests for profile mapping and delivery completeness.
- [x] Run the tests and confirm the utility is missing.
- [x] Implement profile mapping and completeness checks.
- [x] Run the tests and confirm they pass.

### Task 2: Checkout Profile Loading

**Files:**
- Modify: `frontend/src/pages/CheckoutPage.jsx`

- [x] Load `/user/me` with the stored access token.
- [x] Prefill `formData` and select account mode when profile data is complete.
- [x] Fall back to alternate mode without blocking checkout on missing data or errors.

### Task 3: Contact Mode Interface

**Files:**
- Modify: `frontend/src/components/cart/CheckOutForm.jsx`

- [x] Add a two-option contact mode selector.
- [x] Render saved information as a read-only summary in account mode.
- [x] Render editable fields in alternate mode.
- [x] Preserve fulfillment-specific pickup and dine-in controls.

### Task 4: Verification

**Files:**
- Verify only

- [x] Run contact utility tests.
- [x] Run frontend lint.
- [x] Run a production build.
- [ ] Inspect the checkout route in the browser at desktop and mobile widths (browser connection unavailable; local route returned HTTP 200).
