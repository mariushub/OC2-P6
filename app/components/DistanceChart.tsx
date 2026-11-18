import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useApi } from "../hooks/useApi";
import { getUserActivity } from "../services/api";
import { COLORS } from "../theme";
import type { WeekDistance } from "../types";
import { addDays, formatShortDate, getMonday, getWeeklyDistances, toApiDate } from "../utils/format";
import PeriodNav from "./PeriodNav";
import Loader from "./Loader";

const WEEKS = 4;

// Info-bulle noire au survol d'une barre : "01.06 au 07.06 / 19,6 km"
function DistanceTooltip({ active, payload }: { active?: boolean; payload?: { payload: WeekDistance }[] }) {
  if (!active || !payload?.length) return null;
  const week = payload[0].payload;
  return (
    <div className="flex w-[108px] flex-col gap-0.5 rounded-card bg-black/94 px-[13px] py-[23px] text-silver shadow-card-hover">
      <p className="text-body-sm">{week.range}</p>
      <p className="text-body-lg">{week.km.toLocaleString("fr-FR")} km</p>
    </div>
  );
}

// Graphique "km par semaine" sur 4 semaines
export default function DistanceChart() {
  const [offset, setOffset] = useState(0); // 0 = les 4 dernières semaines, -1 = les 4 d'avant…
  const [isHovered, setIsHovered] = useState(false);

  const firstMonday = addDays(getMonday(new Date()), (offset * WEEKS - (WEEKS - 1)) * 7);
  const lastSunday = addDays(firstMonday, WEEKS * 7 - 1);
  const start = toApiDate(firstMonday);
  const end = toApiDate(lastSunday);

  const { data: sessions, isLoading, error } = useApi(getUserActivity, start, end);
  const weeks = sessions && !isLoading ? getWeeklyDistances(sessions, firstMonday, WEEKS) : null;
  const average = weeks ? Math.round(weeks.reduce((total, week) => total + week.km, 0) / WEEKS) : null;

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col rounded-card bg-white px-10 pt-4 pb-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      <header className="pb-10">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-[10px]">
          <h3 className="text-h4 whitespace-nowrap text-primary">{average ?? "–"}km en moyenne</h3>
          <PeriodNav
            label={`${formatShortDate(firstMonday)} - ${formatShortDate(lastSunday)}`}
            onPrevious={() => setOffset(offset - 1)}
            onNext={() => setOffset(offset + 1)}
            canGoNext={offset < 0}
          />
        </div>
        <p className="text-body-sm text-muted">Total des kilomètres {WEEKS} dernières semaines</p>
      </header>

      <div className="h-[262px]">
        {isLoading && <Loader />}
        {error && <p className="text-body text-accent">{error}</p>}
        {weeks && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeks} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
              <CartesianGrid vertical={false} stroke={COLORS.grid} strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: COLORS.line }}
                tick={{ fill: COLORS.muted, fontSize: 12 }}
                tickMargin={16}
                height={40}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: COLORS.line }}
                tick={{ fill: COLORS.muted, fontSize: 10 }}
                allowDecimals={false}
              />
              <Tooltip content={<DistanceTooltip />} cursor={false} />
              <Bar dataKey="km" barSize={14} radius={7} fill={isHovered ? COLORS.primary : COLORS.primaryLight} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-6 flex items-center gap-2 text-body-sm text-muted">
        <span className="size-2 rounded-full" style={{ backgroundColor: COLORS.legendKm }} />
        Km
      </p>
    </article>
  );
}
