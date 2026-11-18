import { useState, type FormEvent } from "react";
import { redirect, useNavigate } from "react-router";
import { getToken, useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";
import Logo from "../components/Logo";
import loginBackground from "../assets/images/login-background.webp";

// Déjà connecté → pas besoin de la page de connexion, on va au dashboard
export function clientLoader() {
  if (getToken()) {
    throw redirect("/dashboard");
  }
  return null;
}

export function meta() {
  return [{ title: "Connexion - SportSee" }];
}

const inputClass =
  "h-[58px] rounded-card border-[0.5px] border-line bg-white px-5 text-body transition duration-300 focus:border-primary focus:outline-none focus:ring-[0.5px] focus:ring-primary";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError("");
    setIsSubmitting(true);
    try {
      await login(String(formData.get("username")), String(formData.get("password")));
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Identifiant ou mot de passe incorrect.");
      } else {
        setError(err instanceof Error ? err.message : "Erreur de connexion.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-[632px_1fr] bg-login">
      {/* Colonne de gauche : logo + formulaire */}
      <div className="flex flex-col gap-[clamp(40px,14.75vh,151px)] bg-page py-[55px] pl-[100px]">
        <Logo />

        <main className="flex w-[398px] flex-col gap-10 rounded-panel bg-white px-10 pt-10 pb-20">
          <h1 className="text-h3 text-primary">
            Transformez
            <br />
            vos stats en résultats
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h2 className="text-h4">Se connecter</h2>

              {/* La maquette indique "Adresse email", mais l'API attend un nom d'utilisateur */}
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-body text-muted">
                  Identifiant
                </label>
                <input id="username" name="username" type="text" autoComplete="username" required className={inputClass} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-body text-muted">
                  Mot de passe
                </label>
                <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
              </div>

              {error && (
                <p role="alert" className="text-body text-accent">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-card bg-primary px-10 py-4 text-body-lg text-silver transition-colors duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-silver disabled:text-muted"
            >
              {isSubmitting ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p className="text-body">Mot de passe oublié ?</p>
        </main>
      </div>

      {/* Colonne de droite : photo */}
      <div className="relative overflow-hidden">
        <img src={loginBackground} alt="" className="absolute inset-0 size-full object-cover" />
        <p className="absolute right-6 bottom-[29px] rounded-full bg-white p-4 text-center text-body-sm text-primary">
          Analysez vos performances en un clin d’œil,
          <br />
          suivez vos progrès et atteignez vos objectifs.
        </p>
      </div>
    </div>
  );
}
