import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";

// Hook pour appeler une fonction de services/api.ts depuis un composant.
// Il récupère le token lui-même : on lui donne juste la fonction et ses autres paramètres.
//   useApi(getUserData)                  → appelle getUserData(token)
//   useApi(getUserActivity, start, end)  → appelle getUserActivity(token, start, end)
// L'appel est relancé quand un des paramètres change (ex. : les dates d'un graphique).
// Renvoie les données, l'état de chargement et l'éventuel message d'erreur.
export function useApi<Args extends unknown[], T>(
  request: (token: string, ...args: Args) => Promise<T>,
  ...args: Args
) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    // Si les paramètres changent avant la fin de l'appel, on ignore l'ancienne réponse
    let ignore = false;
    setIsLoading(true);
    setError(null);

    request(token, ...args)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (ignore) return;
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          // Token refusé (faux ou expiré) → déconnexion
          logout();
          navigate("/");
          return;
        }
        setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token, request, ...args]);

  return { data, isLoading, error };
}
