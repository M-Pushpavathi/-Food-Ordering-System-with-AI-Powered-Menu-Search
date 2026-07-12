import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "ADMIN" | "CUSTOMER" | string;

export interface AuthUser {
  token: string;
  role: Role;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem("token");
  const role = window.localStorage.getItem("role");
  const name = window.localStorage.getItem("name");
  if (!token || !role) return null;
  return { token, role: role.toUpperCase(), name: name ?? "" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const login = useCallback((next: AuthUser) => {
    const normalized = { ...next, role: (next.role || "CUSTOMER").toUpperCase() };
    window.localStorage.setItem("token", normalized.token);
    window.localStorage.setItem("role", normalized.role);
    window.localStorage.setItem("name", normalized.name || "");
    setUser(normalized);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("name");
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ADMIN",
      isCustomer: user?.role === "CUSTOMER",
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}