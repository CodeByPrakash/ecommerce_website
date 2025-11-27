"use client";

import { use, useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import ProductGrid from "@/components/ProductGrid";

export default function ProductPage({ params }) {

  const { id } = use(params);      // Next.js 15 param unwrap
  const { addToCart } = useCart(); // global cart system

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/products");
      const data = await res.json();

      const main = data.find(p => p._id === id);
      setProduct(main);

      const rec = data
        .filter(p => p._id !== id && p.category === main?.category)
        .slice(0, 4);

      setRecommended(rec.length ? rec : data.slice(0, 4));
    }
    load();
  }, [id]);

  if (!product)
    return <p className="text-center mt-10 text-gray-500 text-lg">Loading product...</p>;

  return (
    <div className="space-y-16 animate-pageFade">

      {/* PRODUCT MAIN */}
      <section className="grid md:grid-cols-2 gap-10">

        <div className="bg-white rounded-2xl shadow-xl p-6 flex justify-center">
          <img
            src={product.imageUrl}
            className="rounded-xl w-full max-h-[430px] object-cover shadow-md"
          />
        </div>

        <div className="space-y-6">
          
          {/* Title & Category */}
          <div>
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-black/70 text-sm mt-1">
              Category: <span className="font-semibold text-blue-600">{product.category}</span>
            </p>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-black/5 border border-black/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-[15px] leading-relaxed">
            {product.description}
          </p>

          {/* Dynamic Price */}
          <p className="text-[var(--accent)] text-4xl font-extrabold">
            ₹{product.price * qty}
          </p>

          {/* Qty Selector */}
          <div className="flex items-center gap-4 text-lg">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-lg bg-black text-white font-bold hover:opacity-80"
            >−</button>

            <span className="min-w-[30px] text-center font-semibold">{qty}</span>

            <button
              onClick={() => setQty(q => q + 1)}
              className="w-9 h-9 rounded-lg bg-[var(--accent)] text-white font-bold hover:bg-blue-600"
            >+</button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                addToCart(product, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:opacity-80"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={() => {
                addToCart(product, qty);
                window.location.href = "/checkout";
              }}
              className="bg-[var(--accent)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600"
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* Toast */}
      {added && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-xl shadow-xl animate-slideUp text-sm">
          ✔ Added {qty} item(s) to cart!
        </div>
      )}

      {/* Recommended */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
        <ProductGrid products={recommended} />
      </section>

    </div>
  );
}
