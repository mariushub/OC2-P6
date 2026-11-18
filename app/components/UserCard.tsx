import { useUser } from "../context/UserContext";
import { formatLongDate } from "../utils/format";
import Skeleton from "./Skeleton";

// Photo, nom et date d'inscription de l'utilisateur connecté (Dashboard et Profil)
export default function UserCard({ className = "gap-6" }: { className?: string }) {
  const user = useUser();

  // Données pas encore chargées : même mise en page, avec des skeletons
  if (!user) {
    return (
      <div className={`flex items-center ${className}`}>
        <Skeleton className="h-[117px] w-[104px] shrink-0 rounded-card" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {/* Zoom sur la photo au survol (maquette) */}
      <div className="h-[117px] w-[104px] shrink-0 overflow-hidden rounded-card shadow-card">
        <img
          src={user.profilePicture}
          alt={`Photo de ${user.firstName}`}
          className="size-full object-cover transition-transform duration-300 ease-out hover:scale-[1.7]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-h4">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-body text-muted">Membre depuis le {formatLongDate(user.memberSince)}</p>
      </div>
    </div>
  );
}
