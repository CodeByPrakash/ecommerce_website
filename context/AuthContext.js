"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =============================
  // LOAD AUTH STATE FROM COOKIE
  // =============================
  const loadUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
      const data = await res.json();

      if (res.ok && data.user) setUser(data.user);
      else setUser(null);

    } catch (err) {
      console.log("AUTH LOAD ERROR:", err);
      setUser(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  // =============================
  // LOGIN — INSTANT UI UPDATE
  // =============================
  const login = async (userData) => {
    setUser(userData);  // immediate update NavRight
    await loadUser();   // sync with backend cookie
  };

  // =============================
  // LOGOUT — CLEAR SESSION
  // =============================
  const logout = async () => {
    await fetch("/api/auth/logout", { credentials: "include" });
    setUser(null);
    window.location.href = "/signin";
  };

  // manual refresh when needed
  const refreshUser = async () => { await loadUser(); };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
