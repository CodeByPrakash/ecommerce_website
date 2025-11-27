"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BottomBackButton() {
  const pathname = usePathname();       // hooks always run — good
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname !== "/") setVisible(true);
    else setVisible(false);
  }, [pathname]);

  // 🔥 Instead of returning early — just hide visually
  if (pathname === "/") return null;

  return (
    <div className={`fixed bottom-5 inset-x-0 flex justify-center z-50 transition-all duration-300 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
    }`}>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-5 py-2 text-sm text-slate-200 shadow-lg shadow-black/50 backdrop-blur-md 
        hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-500 hover:text-black transition-all duration-300"
      >
        ← Back
      </button>
    </div>
  );
}
