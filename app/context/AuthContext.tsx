import { createContext, useContext, useState, type ReactNode } from "react";
import * as api from "../services/api";

const COOKIE_NAME = "sportsee_token";

// Lit le token enregistré dans le cookie (null s'il n'y en a pas)
export function getToken(): string | null {
  if (typeof document === "undefined") return null; // pendant le build, il n'y a pas de navigateur
  const cookie = document.cookie.split("; ").find((c) => c.startsWith(COOKIE_NAME + "="));
  return cookie ? cookie.split("=")[1] : null;
}

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken);

  async function login(username: string, password: string) {
    const data = await api.login(username, password); // lance une ApiError si refusé
    // Cookie valable 24 h (comme le token du backend)
    document.cookie = `${COOKIE_NAME}=${data.token}; max-age=86400; path=/; samesite=strict`;
    setToken(data.token);
  }

  function logout() {
    document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`; // max-age=0 supprime le cookie
    setToken(null);
  }

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

// Hook pour utiliser l'authentification dans n'importe quel composant
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  }
  return context;
}
