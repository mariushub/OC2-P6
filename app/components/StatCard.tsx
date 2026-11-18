import Skeleton from "./Skeleton";

// Carte "libellé + valeur + unité" (Dashboard : fond blanc, Profil : fond bleu)
// Sans valeur (données pas encore chargées), un skeleton s'affiche à la place.
type StatCardProps = {
  label: string;
  value?: string | number;
  unit: string;
  tone?: "primary" | "accent" | "inverse";
};

const TONES = {
  primary: { box: "bg-white", label: "text-muted", value: "text-primary", unit: "text-primary-light" },
  accent: { box: "bg-white", label: "text-muted", value: "text-accent", unit: "text-accent-light" },
  inverse: { box: "bg-primary", label: "text-white", value: "text-white", unit: "text-primary-light" },
};

export default function StatCard({ label, value, unit, tone = "primary" }: StatCardProps) {
  const colors = TONES[tone];

  return (
    <div className={`flex flex-col gap-[19px] rounded-card px-[30px] py-5 ${colors.box}`}>
      <p className={`text-body ${colors.label}`}>{label}</p>
      {value === undefined ? (
        <Skeleton light={tone === "inverse"} className="h-[27px] w-28" />
      ) : (
        <p className="flex items-baseline gap-1">
          <span className={`text-h4 ${colors.value}`}>{value}</span>
          <span className={`text-body-lg ${colors.unit}`}>{unit}</span>
        </p>
      )}
    </div>
  );
}
