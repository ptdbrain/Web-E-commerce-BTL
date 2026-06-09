const normalizeString = (value) => String(value || "").trim();

export const normalizeCartKey = (value) => normalizeString(value);

export const buildCartKey = (item = {}) => {
  const productPart = normalizeString(item.productId || item.id);
  const sizePart = normalizeString(item.selectedSize?.label).toLowerCase();
  const addonPart = (Array.isArray(item.selectedAddons) ? item.selectedAddons : [])
    .map((addon) => {
      const label = normalizeString(addon.label || addon.name).toLowerCase();
      const quantity = Number(addon.quantity || 1) || 1;
      const price = Number(addon.price || 0) || 0;
      return `${label}:${quantity}:${price}`;
    })
    .sort()
    .join("|");
  const notePart = normalizeString(item.itemNote || item.note).toLowerCase();

  return [productPart, sizePart, addonPart, notePart].join("::");
};

export const upsertCartItem = (items = [], incomingItem) => {
  const incomingKey = normalizeCartKey(incomingItem?.cartKey);
  const existing = items.find((item) => normalizeCartKey(item.cartKey) === incomingKey);

  if (!existing) {
    return [...items, incomingItem];
  }

  return items.map((item) => {
    if (normalizeCartKey(item.cartKey) !== incomingKey) {
      return item;
    }

    const nextQuantity = item.quantity + incomingItem.quantity;
    return {
      ...item,
      quantity: nextQuantity,
      lineTotal: item.unitPrice * nextQuantity,
    };
  });
};

export const updateCartItemQuantity = (items = [], cartKey, quantity) => {
  const normalizedKey = normalizeCartKey(cartKey);
  const parsedQuantity = Number(quantity);

  if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
    return items.filter(
      (item) => normalizeCartKey(item.cartKey) !== normalizedKey
    );
  }

  return items.map((item) => {
    if (normalizeCartKey(item.cartKey) !== normalizedKey) {
      return item;
    }

    return {
      ...item,
      quantity: parsedQuantity,
      lineTotal: item.unitPrice * parsedQuantity,
    };
  });
};

export const removeCartItem = (items = [], cartKey) =>
  items.filter((item) => normalizeCartKey(item.cartKey) !== normalizeCartKey(cartKey));

export const consumePurchasedCartItems = (items = [], purchasedItems = []) => {
  const purchasedQuantityByKey = new Map();

  for (const item of Array.isArray(purchasedItems) ? purchasedItems : []) {
    const cartKey = normalizeCartKey(item?.cartKey);
    const quantity = Number(item?.quantity);
    if (!cartKey || !Number.isFinite(quantity) || quantity <= 0) continue;

    purchasedQuantityByKey.set(
      cartKey,
      (purchasedQuantityByKey.get(cartKey) || 0) + quantity
    );
  }

  return (Array.isArray(items) ? items : []).flatMap((item) => {
    const cartKey = normalizeCartKey(item?.cartKey);
    const purchasedQuantity = purchasedQuantityByKey.get(cartKey) || 0;
    if (purchasedQuantity <= 0) return [item];

    const currentQuantity = Number(item?.quantity) || 0;
    const remainingQuantity = currentQuantity - purchasedQuantity;
    if (remainingQuantity <= 0) return [];

    return [
      {
        ...item,
        quantity: remainingQuantity,
        lineTotal: (Number(item?.unitPrice) || 0) * remainingQuantity,
      },
    ];
  });
};
