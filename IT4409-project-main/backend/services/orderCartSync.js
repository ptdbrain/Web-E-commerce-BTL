import Cart from "../models/Cart.js";
import { consumePurchasedCartItems } from "../utils/cartDomain.js";

export const consumeOrderCartItems = async (
  order,
  { CartModel = Cart } = {}
) => {
  if (!order || order.cartItemsConsumed) {
    return { consumed: false, cart: null };
  }

  const purchasedItems = (Array.isArray(order.items) ? order.items : []).filter(
    (item) => item?.cartKey
  );
  const cart = await CartModel.findOne({ userId: order.customerId });

  if (cart && purchasedItems.length > 0) {
    cart.items = consumePurchasedCartItems(cart.items, purchasedItems);
    await cart.save();
  }

  order.cartItemsConsumed = true;
  await order.save();

  return { consumed: true, cart };
};

export default { consumeOrderCartItems };
