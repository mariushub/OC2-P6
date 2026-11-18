import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// Liste des routes de l'application
// (l'équivalent du createBrowserRouter([...]) de la doc React Router v6)
export default [
  // Page publique : connexion
  index("pages/Login.tsx"),

  // Pages réservées aux utilisateurs connectés :
  // le layout vérifie le token avant de les afficher
  layout("components/ProtectedLayout.tsx", [
    route("dashboard", "pages/Dashboard.tsx"),
    route("profil", "pages/Profile.tsx"),
  ]),

  // Toutes les autres URL : page 404
  route("*", "pages/NotFound.tsx"),
] satisfies RouteConfig;
