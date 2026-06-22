/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../api/services/authService";
import type { User, LoginRequest, SignupRequest } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

function extractToken(response: unknown): string | undefined {
  if (!response) return undefined;
  if (typeof response === "string") return response;
  if (typeof response !== "object") return undefined;
  const r = response as Record<string, unknown>;
  const known =
    r.token ??
    r.accessToken ??
    r.jwt ??
    r.access_token ??
    r.accessTokenJwt ??
    r.authToken;
  if (known && typeof known === "string") return known;
  for (const val of Object.values(r)) {
    if (typeof val === "string" && val.split(".").length === 3) return val;
  }
  return undefined;
}

function extractUser(response: unknown): User | undefined {
  if (!response || typeof response !== "object") return undefined;
  const r = response as Record<string, unknown>;

  const maybeUser =
    r.user ?? r.userData ?? r.profile ?? r.userDto ?? r.userRecord;
  if (maybeUser && typeof maybeUser === "object") {
    const u = maybeUser as Record<string, unknown>;
    return {
      id: String(u.id ?? ""),
      email: String(u.email ?? ""),
      name: u.name as string | undefined,
    };
  }

  const id = String(r.id ?? r.userId ?? "");
  const email = String(r.email ?? r.username ?? r.mail ?? "");
  if (id || email) {
    return { id, email, name: r.name as string | undefined };
  }

  return undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await authService.getProfile();
        setUser(userData);
      } catch {
        setUser({ id: "", email: "" });
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = (await authService.login(data)) as unknown;
    const token = extractToken(response);
    if (!token) throw new Error("No token in response");
    localStorage.setItem("auth_token", token);
    window.dispatchEvent(new Event("auth-change"));
    const userData = extractUser(response);
    setUser(userData ?? { id: "", email: "" });
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    const response = (await authService.signup(data)) as unknown;
    const token = extractToken(response);
    if (!token) throw new Error("No token in response");
    localStorage.setItem("auth_token", token);
    window.dispatchEvent(new Event("auth-change"));
    const userData = extractUser(response);
    setUser(userData ?? { id: "", email: "" });
  }, []);

  const logout = useCallback(() => {
    authService.logout().catch(() => {});
    localStorage.removeItem("auth_token");
    window.dispatchEvent(new Event("auth-change"));
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
