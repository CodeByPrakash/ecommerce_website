"use client";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return (
    <div className="text-center text-red-500 text-lg font-semibold mt-16 animate-fadeUp">
      You must be logged in to view profile 🔒
    </div>
  );

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-8 animate-fadeUp">

      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Hello, <span className="text-[var(--accent)]">{user.name}</span> 👋
        </h1>
        <p className="text-black/60 text-sm">Manage your account & quick actions</p>
      </div>

      {/* CARD */}
      <div className="rounded-2xl shadow-xl border border-black/10
                      bg-white/80 backdrop-blur-xl p-6 space-y-4">

        <ProfileBtn icon="✏" label="Edit Profile" href="/profile/edit" color="blue" />
        <ProfileBtn icon="📦" label="Orders" href="/orders" color="emerald" />
        <ProfileBtn icon="🛍" label="Cart" href="/cart" color="purple" />
        {user?.role === "admin" && (
          <>
            <ProfileBtn icon="🛍" label="Product Entry" href="/admin" color="black" />
          </>
        )}
        <button 
          onClick={logout}
          className="w-full bg-red-500 text-white font-semibold text-[15px]
                     py-3 rounded-xl hover:bg-red-600 transition shadow-md"
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}


/* ⬇ FIXED COMPONENT WITH STATIC COLOR MAP */
function ProfileBtn({ icon, label, href, color }) {
  const colors = {
    blue:   "border-blue-500 hover:bg-blue-50",
    emerald:"border-emerald-500 hover:bg-emerald-50",
    purple:"border-purple-500 hover:bg-purple-50"
  };

  return (
    <a 
      href={href}
      className={`w-full flex items-center gap-2 text-[15px] font-semibold 
                  py-3 px-4 rounded-xl border border-black/5 bg-white 
                  transition hover:translate-x-1 shadow-sm
                  border-l-4 ${colors[color]}`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </a>
  );
}
