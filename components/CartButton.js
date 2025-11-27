"use client";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { cart } = useCart();

  return (
    <a href="/cart" className="relative hover:text-emerald-400">
      Cart 🛒
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-3 bg-emerald-500 text-black text-[10px] font-bold rounded-full px-1">
          {cart.length}
        </span>
      )}
    </a>
  );
}
