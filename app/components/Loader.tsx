import LogoIcon from "./LogoIcon";

// Indicateur de chargement : l'icône du logo en grand, animée plus vite, centrée dans la zone
export default function Loader({ label = "Chargement…", className = "h-full" }: { label?: string; className?: string }) {
  return (
    <div role="status" className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <LogoIcon className="h-[52px] w-[47px] [&_.animate-equalizer]:[animation-duration:1.2s]" />
      <p className="text-body-sm text-muted">{label}</p>
    </div>
  );
}
