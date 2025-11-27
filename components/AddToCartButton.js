"use client"
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200); // resets back
  }

  return (
    <button
      onClick={handleAdd}
      className={`relative overflow-hidden px-4 py-2 rounded-full font-medium text-sm transition-all
                 ${added ? "bg-green-500 text-white" : "bg-[var(--accent)] text-white hover:bg-blue-500"}
                 active:scale-[0.93]`}  /* Push down animation */
    >
      {/* Button text swap */}
      {added ? "Added ✓" : "Add to Cart"}

      {/* Ripple effect */}
      <span className="absolute inset-0 pointer-events-none" id="rippleBox"></span>
    </button>
  );
}

function handleAdd(e) {
  addToCart(product);
  setAdded(true);

  // 💧 RIPPLES
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");
  e.target.appendChild(ripple);
  setTimeout(()=> ripple.remove(), 500);

  setTimeout(() => setAdded(false), 1200);
}

