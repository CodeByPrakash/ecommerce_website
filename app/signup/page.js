"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message || "Registration failed");
      else router.push("/signin"); // redirect to login after success
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh] animate-fadeUp">
      <div className="
        w-full max-w-md p-8 rounded-[24px] shadow-xl border border-black/10
        bg-white backdrop-blur-xl
      ">
        
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Create Account ✨
        </h1>
        <p className="text-sm text-black/50 text-center mb-6">
          Join our futuristic marketplace.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm rounded-xl bg-red-100 text-red-600 border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={form.name}
              required
              onChange={handleChange}
              className="auth-input peer"
            />
            <label className="auth-label">
              Full Name
            </label>
          </div>

          {/* EMAIL + PHONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="auth-input peer"
              />
              <label className="auth-label">
                Email (optional)
              </label>
            </div>

            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="auth-input peer"
              />
              <label className="auth-label">
                Mobile No (optional)
              </label>
            </div>

          </div>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="auth-input peer"
            />
            <label className="auth-label">
              Password
            </label>
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="
              w-full py-3 rounded-xl text-white font-semibold text-sm
              bg-gradient-to-r from-blue-600 to-blue-500 shadow-md
              hover:opacity-90 active:scale-[.97] transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Creating account..." : "Sign up →"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-black/60">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 font-medium hover:underline">
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
}
