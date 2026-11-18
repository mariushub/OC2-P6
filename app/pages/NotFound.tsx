import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export function meta() {
  return [{ title: "Page introuvable - SportSee" }];
}

export default function NotFound() {
  const { token } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-page text-center">
      <h1 className="text-h1 text-primary">404</h1>
      <p className="text-body-lg text-muted">Oups ! La page que vous demandez n'existe pas.</p>
      <Link
        to={token ? "/dashboard" : "/"}
        className="rounded-card bg-primary px-10 py-4 text-body-lg text-silver transition-colors duration-300 hover:bg-primary-hover"
      >
        {token ? "Retourner au dashboard" : "Retourner à la connexion"}
      </Link>
    </main>
  );
}
