import { createContext, useContext, type ReactNode } from "react";
import { useApi } from "../hooks/useApi";
import { getUserData } from "../services/api";
import type { User } from "../types";

// null tant que les données chargent (les pages affichent alors des skeletons)
const UserContext = createContext<User | null | undefined>(undefined);

// Charge les infos de l'utilisateur UNE fois, puis les partage avec toutes les pages protégées.
// Les pages s'affichent tout de suite : elles reçoivent null pendant le chargement.
export function UserProvider({ children }: { children: ReactNode }) {
  const { data: user, error } = useApi(getUserData);

  if (error) return <p className="text-body text-accent">{error}</p>;

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// Hook pour lire les infos de l'utilisateur connecté (null = pas encore chargées)
export function useUser() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error("useUser doit être utilisé dans <UserProvider>");
  }
  return user;
}
