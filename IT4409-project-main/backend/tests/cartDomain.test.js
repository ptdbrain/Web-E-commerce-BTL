import test from "node:test";
import assert from "node:assert/strict";

import {
  consumePurchasedCartItems,
  upsertCartItem,
  updateCartItemQuantity,
} from "../utils/cartDomain.js";

test("upsertCartItem merges items by cartKey and increases quantity", () => {
  const next = upsertCartItem(
    [
      {
        cartKey: "burger::m::cheese::",
        quantity: 1,
        unitPrice: 69000,
        lineTotal: 69000,
      },
    ],
    {
      cartKey: "burger::m::cheese::",
      quantity: 2,
      unitPrice: 69000,
      lineTotal: 138000,
    }
  );

  assert.deepEqual(next, [
    {
      cartKey: "burger::m::cheese::",
      quantity: 3,
      unitPrice: 69000,
      lineTotal: 207000,
    },
  ]);
});

test("updateCartItemQuantity recalculates line total for the snapshot item", () => {
  const next = updateCartItemQuantity(
    [
      {
        cartKey: "combo::large::sauce::",
        quantity: 1,
        unitPrice: 109000,
        lineTotal: 109000,
      },
    ],
    "combo::large::sauce::",
    3
  );

  assert.deepEqual(next, [
    {
      cartKey: "combo::large::sauce::",
      quantity: 3,
      unitPrice: 109000,
      lineTotal: 327000,
    },
  ]);
});

test("consumePurchasedCartItems subtracts only the purchased quantity", () => {
  const next = consumePurchasedCartItems(
    [
      {
        cartKey: "burger::m::cheese::",
        quantity: 4,
        unitPrice: 69000,
        lineTotal: 276000,
      },
      {
        cartKey: "drink::l::::",
        quantity: 1,
        unitPrice: 25000,
        lineTotal: 25000,
      },
    ],
    [
      {
        cartKey: "burger::m::cheese::",
        quantity: 2,
      },
    ]
  );

  assert.deepEqual(next, [
    {
      cartKey: "burger::m::cheese::",
      quantity: 2,
      unitPrice: 69000,
      lineTotal: 138000,
    },
    {
      cartKey: "drink::l::::",
      quantity: 1,
      unitPrice: 25000,
      lineTotal: 25000,
    },
  ]);
});

test("consumePurchasedCartItems removes a line when all quantity was purchased", () => {
  const next = consumePurchasedCartItems(
    [
      {
        cartKey: "burger::m::cheese::",
        quantity: 2,
        unitPrice: 69000,
        lineTotal: 138000,
      },
    ],
    [
      {
        cartKey: "burger::m::cheese::",
        quantity: 2,
      },
    ]
  );

  assert.deepEqual(next, []);
});
