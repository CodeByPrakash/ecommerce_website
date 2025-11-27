"use client";
import { useState, useEffect } from "react";
import SearchFilters from "@/components/SearchFilters";  // your filter component
import ProductGrid from "@/components/ProductGrid";

export default function HomePage() {

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    tag: "",
    price: ""
  });

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // 🔥 MAIN FILTER ENGINE
  const filteredProducts = products.filter(p => {

    // 1️⃣ Search text match
    if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase()))
      return false;

    // 2️⃣ Category match
    if (filters.category && p.category !== filters.category)
      return false;

    // 3️⃣ Tag match
    if (filters.tag && !p.tags?.some(t => t.toLowerCase().includes(filters.tag)))
      return false;

    // 4️⃣ Price range match
    if (filters.price) {
      const price = p.price;
      if (filters.price === "0-500" && !(price >= 0 && price <= 500)) return false;
      if (filters.price === "500-2000" && !(price >= 500 && price <= 2000)) return false;
      if (filters.price === "2000-5000" && !(price >= 2000 && price <= 5000)) return false;
      if (filters.price === "5000+" && !(price >= 5000)) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8">

      <SearchFilters filters={filters} setFilters={setFilters} />

      {/* 🟩 RESULT GRID */}
      <ProductGrid products={filteredProducts} />

      {/* No result UI */}
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 text-sm mt-10">No products found.</p>
      )}
    </div>
  );
}
