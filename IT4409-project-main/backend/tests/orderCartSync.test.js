import test from "node:test";
import assert from "node:assert/strict";

import { consumeOrderCartItems } from "../services/orderCartSync.js";

const createOrder = (overrides = {}) => ({
  customerId: "64f300000000000000000001",
  cartItemsConsumed: false,
  items: [
    {
      cartKey: "burger::regular::::",
      quantity: 2,
    },
  ],
  saveCalls: 0,
  async save() {
    this.saveCalls += 1;
  },
  ...overrides,
});

test("consumeOrderCartItems updates the cart and marks the order once", async () => {
  const order = createOrder();
  const cart = {
    items: [
      {
        cartKey: "burger::regular::::",
        quantity: 3,
        unitPrice: 69000,
        lineTotal: 207000,
      },
    ],
    saveCalls: 0,
    async save() {
      this.saveCalls += 1;
    },
  };
  const CartModel = {
    async findOne() {
      return cart;
    },
  };

  const result = await consumeOrderCartItems(order, { CartModel });

  assert.equal(result.consumed, true);
  assert.equal(cart.saveCalls, 1);
  assert.equal(order.saveCalls, 1);
  assert.equal(order.cartItemsConsumed, true);
  assert.deepEqual(cart.items, [
    {
      cartKey: "burger::regular::::",
      quantity: 1,
      unitPrice: 69000,
      lineTotal: 69000,
    },
  ]);
});

test("consumeOrderCartItems is idempotent after the order was consumed", async () => {
  const order = createOrder({ cartItemsConsumed: true });
  let findCalls = 0;
  const CartModel = {
    async findOne() {
      findCalls += 1;
      return null;
    },
  };

  const result = await consumeOrderCartItems(order, { CartModel });

  assert.equal(result.consumed, false);
  assert.equal(findCalls, 0);
  assert.equal(order.saveCalls, 0);
});

test("consumeOrderCartItems still marks an order when the cart is missing", async () => {
  const order = createOrder();
  const CartModel = {
    async findOne() {
      return null;
    },
  };

  const result = await consumeOrderCartItems(order, { CartModel });

  assert.equal(result.consumed, true);
  assert.equal(order.cartItemsConsumed, true);
  assert.equal(order.saveCalls, 1);
});
