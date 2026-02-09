import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signin, signup as apiSignup } from "../api/auth.api";
import { fetchMe, logout as apiLogout } from "../api/user.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // hydrate from server if cookie exists
    fetchMe()
      .then((data) => {
        if (data?.loggedIn) setUser(data.user);
      })
      .finally(() => setInitializing(false));
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await signin({ email, password });
      const data = await fetchMe();
      if (data?.loggedIn) setUser(data.user);
      return data?.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      await apiSignup(payload);
      const data = await fetchMe();
      if (data?.loggedIn) setUser(data.user);
      return data?.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await apiLogout().catch(() => {});
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loggedIn: Boolean(user),
      loading,
      initializing,
      login,
      signup,
      logout,
      refresh: fetchMe,
    }),
    [user, loading, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
