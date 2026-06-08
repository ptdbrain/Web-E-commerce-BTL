# Checkout Contact Options Design

## Goal

Use the signed-in customer's saved contact information by default while allowing
a separate recipient and delivery address for one order.

## Behavior

- Checkout loads `/user/me` once when an authenticated customer opens the page.
- The default mode is `account` when name, phone, and the required delivery
  address are available.
- Account mode fills the order form from the profile and presents the values as
  a compact read-only summary.
- Alternate mode presents editable name, phone, and delivery address fields.
- Switching back to account mode restores current profile values.
- Alternate values are order-only and never update the user profile.
- Pickup and dine-in require only recipient name and phone; delivery also
  requires an address.
- If profile loading fails or required data is missing, checkout selects
  alternate mode and keeps ordering available.

