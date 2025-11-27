"use client";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductGrid({ products }) {

  return (
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map(product => (
        <article key={product._id}
          className="
            bg-white shadow-lg rounded-[var(--radius)] border border-black/5 
            hover:shadow-[var(--shadow-hover)] hover:-translate-y-[4px]
            transition-all duration-300 overflow-hidden group
          ">

          {/* PRODUCT IMAGE */}
          <a href={`/product/${product._id}`} className="block group">
            <div className="overflow-hidden rounded-[var(--radius)]">
              <img src={product.imageUrl}
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-500" />
            </div>
          </a>

          {/* BODY */}
          <div className="p-5">
            <h3 className="font-semibold text-[16px] text-black">{product.title}</h3>

            <p className="text-[13px] text-black/60 line-clamp-2 mt-1">
              {product.description}
            </p>

            <div className="flex justify-between items-center mt-4">
              <p className="font-bold text-[var(--accent)] text-lg">₹{product.price}</p>

              {/* 🚀 Replaced with animated button */}
              <AddToCartButton product={product}/>
            </div>
          </div>

        </article>
      ))}
    </div>
  );
}
