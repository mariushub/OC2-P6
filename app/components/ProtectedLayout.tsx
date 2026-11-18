import { Outlet, redirect } from "react-router";
import { getToken } from "../context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";

// S'exécute AVANT d'afficher une page protégée :
// pas de token → on renvoie vers la page de connexion
export function clientLoader() {
  if (!getToken()) {
    throw redirect("/");
  }
  return null;
}

// Mise en page commune aux pages protégées
export default function ProtectedLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="mx-auto w-full max-w-[1188px] flex-1 px-6 pt-[108px] pb-20">
        <Outlet /> {/* la page demandée (Dashboard, Profil) s'affiche ici */}
      </main>
      <Footer />
    </div>
  );
}
