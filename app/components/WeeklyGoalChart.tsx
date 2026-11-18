import { Cell, Pie, PieChart } from "recharts";
import { COLORS } from "../theme";
import { WEEKLY_GOAL } from "../utils/format";

// Anneau "courses réalisées / objectif de la semaine"
export default function WeeklyGoalChart({ done }: { done: number }) {
  const remaining = Math.max(WEEKLY_GOAL - done, 0);
  const data = [
    { name: "réalisées", value: done },
    { name: "restants", value: remaining },
  ];

  return (
    <article className="flex flex-col items-center rounded-card bg-white px-[38px] pt-4 pb-8 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <header className="w-full pb-8">
        <p className="flex h-12 items-center gap-[5px]">
          <span className="text-h3 text-primary">x{done}</span>
          <span className="text-body-lg text-primary-light">sur objectif de {WEEKLY_GOAL}</span>
        </p>
        <p className="text-body text-muted">Courses hebdomadaire réalisées</p>
      </header>

      <div className="relative h-[190px] w-[306px]">
        <div className="absolute top-[14px] left-[72px]">
          {/* startAngle 0 = 3 h, endAngle -360 = tour complet dans le sens des aiguilles d'une montre */}
          <PieChart width={163} height={163}>
            <Pie data={data} dataKey="value" innerRadius="50%" outerRadius="100%" startAngle={0} endAngle={-360} stroke="none">
              <Cell fill={COLORS.primary} />
              <Cell fill={COLORS.primaryLight} />
            </Pie>
          </PieChart>
        </div>
        <p className="absolute top-[10px] left-[213px] flex items-center gap-2 text-caption text-muted">
          <span className="size-[6.5px] rounded-full" style={{ backgroundColor: COLORS.primaryLight }} />
          {remaining} {remaining > 1 ? "restants" : "restant"}
        </p>
        <p className="absolute top-[133px] left-0 flex items-center gap-2 text-caption text-muted">
          <span className="size-[6.5px] rounded-full" style={{ backgroundColor: COLORS.primary }} />
          {done} {done > 1 ? "réalisées" : "réalisée"}
        </p>
      </div>
    </article>
  );
}
