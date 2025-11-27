"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import ProductSkeletonGrid from "@/components/ProductSkeletonGrid";
import SearchFilters from "@/components/SearchFilters";
import Loader from "@/components/Loader";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true); // true = loading from API

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    tag: "",
    price: ""
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data || []);
        setFiltered(data || []);
      } catch {
        setProducts([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  

  // ========== FILTER ENGINE ==========
  useEffect(() => {
    let list = [...products];

    if (filters.search)
      list = list.filter(p => p.title.toLowerCase().includes(filters.search.toLowerCase()));

    if (filters.category)
      list = list.filter(p => p.category === filters.category);

    if (filters.tag)
      list = list.filter(p => p.tags?.some(t => t.toLowerCase().includes(filters.tag)));

    if (filters.price) {
      const [min, max] = filters.price === "5000+" ? [5000, Infinity] : filters.price.split("-").map(Number);
      list = list.filter(p => p.price >= min && p.price <= max);
    }

    setFiltered(list);
  }, [filters, products]);

  return (
    <div className="animate-pageFade space-y-10">
      {/* Page Loader Overlay */}
      <Loader loading={loading} />

      {/* Product Skeleton */}
      {loading && products.length > 0 && <ProductSkeletonGrid count={8} />}

      {/* Product Grid */}
      {!loading && filtered.length > 0 && <ProductGrid products={filtered} />}

      {/* No products fallback */}
      {!loading && products.length === 0 && (
        <p className="text-center text-black/60 mt-10">
          No products available.
        </p>
      )}
    </div>
  );
}
