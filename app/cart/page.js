"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { cart, updateQty, removeFromCart } = useCart();
  const { user } = useAuth();

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((n, i) => n + i.qty, 0);

  function handleCheckout() {
    if (!user) return window.location.href = "/signin";
    window.location.href = "/checkout";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fadeUp">

      {/* ---- Header ---- */}
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        Your <span className="text-[var(--accent)]">Cart</span>
      </h1>

      {cart.length === 0 ? (
        <p className="text-black/60 text-lg text-center mt-10">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">

          {/* LEFT — CART LIST */}
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item._id}
                className="flex gap-5 p-5 rounded-xl bg-white backdrop-blur-xl border border-black/5
                           shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-out">

                <img src={item.imageUrl} className="h-24 w-24 rounded-lg object-cover shadow-md" />

                <div className="flex-1 space-y-1">
                  <h2 className="font-semibold text-[17px]">{item.title}</h2>
                  <p className="text-sm text-black/50 line-clamp-2">{item.description}</p>

                  <p className="font-semibold text-[var(--accent)] text-lg mt-1">
                    ₹ {item.price * item.qty}
                  </p>

                  {/* Quantity + remove */}
                  <div className="flex items-center gap-3 mt-3">

                    {/* QUANTITY STEPPERS */}
                    <div className="flex items-center gap-2 bg-black/5 rounded-full px-3 py-1.5">

                      <button 
                        onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-black shadow hover:scale-105 transition"
                      >−</button>

                      <span className="min-w-[24px] text-center font-medium">{item.qty}</span>

                      <button 
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--accent)] text-white shadow hover:scale-105 transition"
                      >+</button>

                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 font-medium text-xs hover:underline ml-auto"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — SUMMARY BOX */}
          <div className="rounded-2xl p-7 bg-white shadow-lg border border-black/5 h-fit animate-fadeIn">

            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2 text-black/70 text-sm">
              <span>Items: </span> <span>{itemCount}</span>
            </div>

            <div className="flex justify-between mb-1 text-black/70 text-sm">
              <span>Subtotal:</span> <span>₹{total}</span>
            </div>

            <div className="border-t my-3"></div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[var(--accent)]">₹{total}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="mt-6 w-full py-3 rounded-full bg-[var(--accent)] text-white text-[15px] font-semibold
                         shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-300 ease-out"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
