"use client";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";

export default function NavRight() {
  const { user, loading } = useAuth();
  if (loading) return null;

  /* 🔴 Not Logged In */
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <a href="/signin" className="btn-light">Sign In</a>
        <a href="/signup" className="btn-primary">Sign Up</a>
      </div>
    );
  }

  /* 🟢 Logged in dropdown */
  return (
    <div className="relative group cursor-pointer">

      {/* Avatar/Profile trigger */}
      <div className="nav-pill">
        {user?.name?.split(" ")[0] ?? "Profile"}
      </div>

      {/* Hover dropdown */}
      <div className="nav-dropdown">
        <a href="/profile" className="dropdown-item">Profile</a>
        <a href="/orders"  className="dropdown-item">Orders</a>
        <a href="/cart"    className="dropdown-item">Cart</a>
        {/* 👇 Show only if user is ADMIN */}
        {user?.role === "admin" && (
          <>
            <div className="drop-divider"></div>
            <a href="/admin" className="dropdown-item text-red-500 font-semibold">
              🛠 Product Entry
            </a>
          </>
        )}
        <div className="drop-divider"></div>
        <LogoutButton />
      </div>
    </div>
  );
}
