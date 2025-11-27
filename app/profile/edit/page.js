"use client";
import "../../globals.css";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function EditProfile() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: { house: "", city: "", state: "", pin: "" },
    password: ""
  });

  // Load existing profile values
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.user) {
        setForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          password: "",
          address: {
            house: data.user.address?.house || "",
            city: data.user.address?.city || "",
            state: data.user.address?.state || "",
            pin: data.user.address?.pin || ""
          }
        });
      }
    }
    loadUser();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (!user) return <p className="text-center text-red-500">Login required ❌</p>;

  // Handle normal text fields
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Handle nested address fields
  function handleAddress(e) {
    setForm(prev => ({
      ...prev,
      address: { ...prev.address, [e.target.name]: e.target.value }
    }));
  }

  async function updateProfile() {
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Profile Updated Successfully 🎉");
      window.location.href = "/profile";
    } else alert("Update Failed ❌");
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl p-7 rounded-2xl space-y-6 animate-fadeUp">

      <h1 className="text-2xl font-bold text-center">
        ✏ Edit Profile
      </h1>

      <div className="space-y-4">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="auth-input w-full"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="auth-input w-full"
          required={true}
        />

        {/* 🏠 ADDRESS BLOCK */}
        <h3 className="font-semibold text-sm opacity-70">Address</h3>

        <input
          name="house"
          value={form.address.house}
          onChange={handleAddress}
          placeholder="House / Street"
          className="auth-input w-full"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            name="city"
            value={form.address.city}
            onChange={handleAddress}
            placeholder="City"
            className="auth-input"
          />

          <input
            name="state"
            value={form.address.state}
            onChange={handleAddress}
            placeholder="State"
            className="auth-input"
          />
        </div>

        <input
          name="pin"
          value={form.address.pin}
          onChange={handleAddress}
          placeholder="PIN Code"
          className="auth-input w-full"
        />

        {/* OPTIONAL PASSWORD UPDATE */}
        <input
          type="password"
          name="password"
          placeholder="New Password (optional)"
          onChange={handleChange}
          className="auth-input w-full"
        />
      </div>

      <button
        onClick={updateProfile}
        className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 shadow-md"
      >
        💾 Save Changes
      </button>

    </div>
  );
}
