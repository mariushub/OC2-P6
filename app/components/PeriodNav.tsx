// Navigation ‹ période › au-dessus des graphiques
type PeriodNavProps = {
  label: string; // ex. "28 mai - 25 juin"
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean; // false sur la période en cours (pas de futur)
};

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M14 8L10 12L14 16" : "M10 8L14 12L10 16"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const buttonClass =
  "flex size-6 cursor-pointer items-center justify-center rounded-card border border-line bg-white text-ink transition-colors duration-300 hover:border-primary hover:bg-primary-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:bg-white disabled:hover:text-ink";

export default function PeriodNav({ label, onPrevious, onNext, canGoNext }: PeriodNavProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={onPrevious} aria-label="Période précédente" className={buttonClass}>
        <Arrow direction="left" />
      </button>
      <span className="text-body-sm whitespace-nowrap">{label}</span>
      <button type="button" onClick={onNext} disabled={!canGoNext} aria-label="Période suivante" className={buttonClass}>
        <Arrow direction="right" />
      </button>
    </div>
  );
}
