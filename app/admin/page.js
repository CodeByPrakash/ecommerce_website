"use client";

import { useEffect, useState } from "react";

/* =================== FIXED — MOVE THESE OUTSIDE COMPONENT =================== */

function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="label">{label}</label>
      <input {...props} className="input-glass" />
    </div>
  );
}

function TagsInput({ productForm, setProductForm }) {
  const [tag, setTag] = useState("");

  function addTag(e) {
    if (e.key === "Enter" && tag.trim()) {
      e.preventDefault(); // stops form submission by Enter ✔
      setProductForm(prev => ({ ...prev, tags: [...prev.tags, tag.trim()] }));
      setTag("");
    }
  }

  function removeTag(i) {
    setProductForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== i)
    }));
  }

  return (
    <div className="md:col-span-2 space-y-1">
      <label className="label">Tags (Press Enter)</label>

      <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
        {productForm.tags.map((t, i) => (
          <span key={i} className="tag" onClick={() => removeTag(i)}>
            {t} ✕
          </span>
        ))}
        <input
          value={tag}
          onChange={e => setTag(e.target.value)}
          onKeyDown={addTag}
          className="bg-transparent outline-none flex-1"
          placeholder="Type & hit Enter"
        />
      </div>
    </div>
  );
}

function StockToggle({ productForm, setProductForm }) {
  return (
    <div className="flex items-center gap-3 md:col-span-2">
      <label className="label">In Stock:</label>

      <div
        className={`toggle ${productForm.inStock ? "on" : ""}`}
        onClick={() =>
          setProductForm(prev => ({ ...prev, inStock: !prev.inStock }))
        }
      >
        <div className="circle"></div>
      </div>
    </div>
  );
}

/* ====================== MAIN ADMIN COMPONENT ====================== */

export default function AdminPage() {
  const [auth, setAuth] = useState({ loading: true, isAdmin: false });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
    tags: [],
    inStock: true
  });

  const [saving, setSaving] = useState(false);

  /* ================= Check Admin ================= */
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = res.ok ? await res.json() : null;

        setAuth({
          loading: false,
          isAdmin: data?.user?.role === "admin"
        });
      } catch {
        setAuth({ loading: false, isAdmin: false });
      }
    }
    checkAuth();
  }, []);

  /* ================= Load Products + Users ================= */
  useEffect(() => {
    if (!auth.isAdmin) return;

    async function loadData() {
      try {
        const [p, u] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/users")
        ]);

        setProducts(p.ok ? await p.json() : []);
        setUsers(u.ok ? await u.json() : []);
      } catch {
        setError("Failed to load admin data");
      }
    }

    loadData();
  }, [auth.isAdmin]);

  function handleProductChange(e) {
    setProductForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  /* ================= Add Product ================= */
  async function handleAddProduct(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productForm, price: Number(productForm.price) })
      });

      const data = await res.json();

      if (!res.ok) setError(data.message || "Failed to add product");
      else {
        setProducts(prev => [data, ...prev]);
        setProductForm({
          title: "",
          price: "",
          description: "",
          imageUrl: "",
          category: "",
          tags: [],
          inStock: true
        });
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  /* ================= UI ================= */

  if (auth.loading) return <p className="text-slate-400">Checking admin access...</p>;

  if (!auth.isAdmin)
    return (
      <div className="max-w-md mx-auto mt-10 border border-red-500/50 p-6 rounded-xl bg-red-500/10 text-center text-red-200">
        ❌ You are not authorized.
      </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* ==================== PRODUCT FORM ==================== */}
      <section className="p-8 rounded-2xl shadow-xl bg-white/10 border border-white/20 backdrop-blur-xl space-y-6">
        <h2 className="text-xl font-bold">🛒 Add New Product</h2>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-6">

          {/* IMAGE */}
          <div className="md:col-span-2 flex flex-col items-center gap-4">
            {productForm.imageUrl ? (
              <img src={productForm.imageUrl} className="w-32 h-32 rounded-xl object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-white/10 flex justify-center items-center text-white/40">
                Preview
              </div>
            )}

            <input
              type="url"
              name="imageUrl"
              value={productForm.imageUrl}
              onChange={handleProductChange}
              placeholder="Image URL"
              required
              className="input-glass w-full"
            />
          </div>

          {/* Title */}
          <InputField label="Product Title" name="title" value={productForm.title} onChange={handleProductChange} required />

          {/* Price */}
          <InputField label="Price (₹)" name="price" type="number" value={productForm.price} onChange={handleProductChange} required />

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select name="category" value={productForm.category} onChange={handleProductChange} className="select-glass" required>
              <option value="">Select category</option>
              <option value="electronics">📱 Electronics</option>
              <option value="clothing">👕 Clothing</option>
              <option value="accessories">⌚ Accessories</option>
              <option value="gaming">🎮 Gaming</option>
              <option value="shoes">👟 Shoes</option>
            </select>
          </div>

          {/* Tags */}
          <TagsInput productForm={productForm} setProductForm={setProductForm} />

          {/* Description */}
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea name="description" rows={3} value={productForm.description} onChange={handleProductChange} className="input-glass w-full" required />
          </div>

          {/* Stock */}
          <StockToggle productForm={productForm} setProductForm={setProductForm} />

          {/* Submit */}
          <button disabled={saving} className="md:col-span-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-semibold shadow-lg">
            {saving ? "Adding..." : "✨ Add Product"}
          </button>

        </form>
      </section>
    </div>
  );
}
