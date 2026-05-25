import { useContext } from "react";
import { CartContext } from "../contexts/CartContextBase";

export function useCart() {
  return useContext(CartContext);
}
