"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Checkout() {

  const { cart, updateQty, clearCart } = useCart(); // 👈 updateQty used here
  const { user, loading } = useAuth();

  // ================== USER PREFILL =====================
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    house: "",
    city: "",
    state: "",
    pin: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.name || "",
      phone: user.phone || "",
      house: user.address?.house || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      pin: user.address?.pin || "",
    });
  }, [user]);

  // ============ AUTH CHECK (after hooks) ============
  if (loading) return <p className="text-center text-gray-500 mt-10">Checking login...</p>;
  if (!user) { window.location.href = "/signin"; return null; }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  async function placeOrder() {
    if (Object.values(form).some(v => !v))
      return alert("⚠ Fill all delivery details");

    const res = await fetch("/api/orders", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ items:cart,total,address:form })
    });

    if(res.ok){
      clearCart();
      window.location.href="/order-success";
    } 
    else alert("Order failed ❌");
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-8 animate-pageFade">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Checkout 🛍</h1>
        <p className="text-black/60 text-sm">Update delivery or product quantity before confirming</p>
      </div>

      {/* DELIVERY FORM */}
      <div className="glass-card rounded-2xl p-6 border border-black/10 shadow-xl space-y-4">
        <h2 className="font-semibold text-lg">Delivery Information</h2>

        <div className="grid grid-cols-2 gap-3">
          <input className="auth-input col-span-2" name="fullName" value={form.fullName} placeholder="Full Name" onChange={e=>setForm({...form,[e.target.name]:e.target.value})}/>
          <input className="auth-input col-span-2" name="phone" value={form.phone} placeholder="Phone Number" onChange={e=>setForm({...form,[e.target.name]:e.target.value})}/>
          <input className="auth-input col-span-2" name="house" value={form.house} placeholder="House / Street" onChange={e=>setForm({...form,[e.target.name]:e.target.value})}/>
          <input className="auth-input" name="city" value={form.city} placeholder="City" onChange={e=>setForm({...form,[e.target.name]:e.target.value})}/>
          <input className="auth-input" name="state" value={form.state} placeholder="State" onChange={e=>setForm({...form,[e.target.name]:e.target.value})}/>
          <input className="auth-input" name="pin" value={form.pin} placeholder="PIN Code" onChange={e=>setForm({...form,[e.target.name]:e.target.value})}/>
        </div>
      </div>


      {/* CART SUMMARY WITH LIVE QUANTITY EDIT */}
      <div className="rounded-2xl bg-white p-6 shadow-xl border border-black/10 space-y-3">
        <h2 className="font-semibold text-lg">Order Summary</h2>

        {cart.map(item => (
          <div key={item._id} className="flex justify-between items-center py-2 border-b last:border-none">

            <div className="flex flex-col">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-gray-500">₹{item.price} each</p>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))} // 🔒 Cannot go below 1
                className="w-7 h-7 rounded-full bg-gray-200 text-black text-sm font-bold disabled:opacity-40"
                disabled={item.qty === 1} // ⛔ block if qty <= 1
              >−</button>

              <span className="font-semibold">{item.qty}</span>

              <button
                onClick={() => updateQty(item._id, item.qty + 1)} // 🔥 increase
                className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-sm font-bold"
              >+</button>
            </div>

            <p className="font-bold text-[var(--accent)]">₹{item.qty * item.price}</p>
          </div>
        ))}

        {/* TOTAL */}
        <div className="flex justify-between text-lg font-bold pt-3 border-t">
          <span>Total</span>
          <span className="text-green-600">₹{total}</span>
        </div>
      </div>

      {/* PLACE ORDER */}
      <button onClick={placeOrder} className="w-full btn-primary py-3 rounded-xl shadow-lg hover:shadow-blue-300/40">
        Place Order ✔
      </button>
    </div>
  );
}
