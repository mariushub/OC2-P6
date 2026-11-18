// Bloc gris qui clignote doucement, affiché à la place d'un contenu pas encore chargé.
// light : version claire, pour les fonds bleus.
export default function Skeleton({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-md ${light ? "bg-white/25" : "bg-silver"} ${className}`}
    />
  );
}
