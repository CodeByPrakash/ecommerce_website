// Loader.js
"use client";
import { useEffect, useState } from "react";

export default function Loader({ loading }) {
  const [visible, setVisible] = useState(loading);

  useEffect(() => {
    setVisible(loading);
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#F7F8FA] transition-all duration-700">
      <div className="relative flex flex-col items-center">
        <div className="w-36 h-36 rounded-full border-4 border-blue-300/30 border-t-blue-600 animate-spin-slow"></div>
        <div className="absolute w-12 h-12 bg-blue-600 rounded-full animate-pulse-tech shadow-xl shadow-blue-400/40"></div>
        <p className="mt-16 text-xs tracking-[0.25em] text-blue-700 animate-fadeText">
          SYSTEM BOOTING...
        </p>
      </div>
    </div>
  );
}
