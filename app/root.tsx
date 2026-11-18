// Fichier imposé par Create React Router (l'équivalent du main.tsx d'un projet classique) :
// le squelette HTML de toutes les pages + le AuthProvider autour de l'application.
// Les routes sont dans routes.ts.
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import Loader from "./components/Loader";
import { AuthProvider } from "./context/AuthContext";
import "./app.css";

// Police Inter (Google Fonts)
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <Outlet /> {/* la page correspondant à l'URL s'affiche ici */}
    </AuthProvider>
  );
}

// Affiché au tout premier chargement, le temps que le JavaScript démarre
export function HydrateFallback() {
  // return <div className="min-h-screen min-w-screen bg-blue-400" />;
  return <Loader className="min-h-screen bg-page" />;
}

// Affiché si une erreur inattendue se produit (l'équivalent de errorElement dans la doc v6)
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oups !";
  let details = "Une erreur inattendue s'est produite.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Erreur";
    details = error.status === 404 ? "La page demandée est introuvable." : error.statusText;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
  }

  return (
    <main className="p-16">
      <h1 className="text-h3">{message}</h1>
      <p>{details}</p>
    </main>
  );
}
