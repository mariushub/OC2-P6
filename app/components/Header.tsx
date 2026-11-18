import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

// Lien du menu : bleu au survol et sur la page en cours
function linkClass({ isActive }: { isActive: boolean }) {
  return `transition-colors duration-300 hover:text-primary ${isActive ? "text-primary" : ""}`;
}

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="mx-auto flex w-full max-w-[1188px] items-center justify-between px-6 pt-[35px]">
      <Logo />

      <nav className="flex items-center gap-10 rounded-pill bg-white/90 px-12 py-4 text-body">
        <div className="flex gap-10 border-r-[0.5px] border-primary pr-10">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/profil" className={linkClass}>
            Mon profil
          </NavLink>
        </div>
        <button type="button" onClick={handleLogout} className="cursor-pointer text-primary">
          Se déconnecter
        </button>
      </nav>
    </header>
  );
}
