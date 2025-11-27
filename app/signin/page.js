"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const { login } = useAuth();
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) return setError(data.message || "Login failed");

    await login(data.user);       // UI instantly updates
    router.push("/");             // redirects to homepage

  } catch {
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-fadeUp">
      <div className="
        w-full max-w-md p-8 rounded-[24px] shadow-xl border border-black/10
        bg-white backdrop-blur-xl
      ">

        <h1 className="text-2xl font-bold tracking-tight text-center">Welcome Back 👋</h1>
        <p className="text-sm text-black/50 text-center mb-6">
          Sign in using your email or mobile number.
        </p>

        {error &&
          <p className="mb-4 p-3 text-sm rounded-xl bg-red-100 text-red-600 border border-red-300">
            {error}
          </p>
        }

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL / PHONE FIELD */}
          <div className="relative">
            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              required
              className="auth-input peer"
            />
            <label className="auth-label peer-focus:text-blue-500 peer-focus:-translate-y-6">
              Email / Mobile Number
            </label>
          </div>

          {/* PASSWORD FIELD */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="auth-input peer"
            />
            <label className="auth-label peer-focus:text-blue-500 peer-focus:-translate-y-6">
              Password
            </label>
          </div>

          {/* LOGIN BUTTON */}
          <button
            disabled={loading}
            className="
              w-full py-3 rounded-xl text-white font-semibold text-sm
              bg-gradient-to-r from-blue-600 to-blue-500 shadow-md
              hover:opacity-90 active:scale-[.97] transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
           "
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-black/60">
          New here?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Create an account
          </a>
        </p>

      </div>
    </div>
  );
}
