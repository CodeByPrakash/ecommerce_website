"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    window.location.href = "/signin";
  };

  return (
    <button 
      onClick={handleLogout}
      className="header-item text-red-500 hover:bg-red-50 text-left w-full p-4 text-center"
    >
      Logout
    </button>
  );
}
