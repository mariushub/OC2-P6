import { useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useApi } from "../hooks/useApi";
import { getUserActivity } from "../services/api";
import { COLORS } from "../theme";
import type { DayHeartRate } from "../types";
import { addDays, formatShortDate, getAverageHeartRate, getDailyHeartRates, getMonday, toApiDate } from "../utils/format";
import PeriodNav from "./PeriodNav";
import Loader from "./Loader";

// Info-bulle au survol d'un jour
function HeartRateTooltip({ active, payload }: { active?: boolean; payload?: { payload: DayHeartRate }[] }) {
  if (!active || !payload?.length) return null;
  const day = payload[0].payload;
  if (day.max === null) return null;
  return (
    <div className="flex flex-col gap-0.5 rounded-card bg-black/94 px-[13px] py-3 text-body-sm text-silver shadow-card-hover">
      <p>Min : {day.min} BPM</p>
      <p>Max : {day.max} BPM</p>
      <p>Moyenne : {day.average} BPM</p>
    </div>
  );
}

function LegendItem({ color, label, line = false }: { color: string; label: string; line?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="relative flex w-3 items-center justify-center">
        {line && <span className="absolute h-px w-3" style={{ backgroundColor: COLORS.primaryLight }} />}
        <span className="relative size-2 rounded-full" style={{ backgroundColor: color }} />
      </span>
      {label}
    </span>
  );
}

// Graphique "fréquence cardiaque" d'une semaine : min / max par jour + courbe de la moyenne
export default function HeartRateChart() {
  const [offset, setOffset] = useState(0); // 0 = semaine en cours, -1 = semaine précédente…
  const [isHovered, setIsHovered] = useState(false);

  const monday = addDays(getMonday(new Date()), offset * 7);
  const sunday = addDays(monday, 6);
  const start = toApiDate(monday);
  const end = toApiDate(sunday);

  const { data: sessions, isLoading, error } = useApi(getUserActivity, start, end);
  const ready = sessions && !isLoading && !error;
  const days = ready ? getDailyHeartRates(sessions, monday) : [];
  const average = ready ? getAverageHeartRate(sessions) : null;

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col rounded-card bg-white px-10 pt-4 pb-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      <header className="pb-10">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-[10px]">
          <h3 className="text-h4 whitespace-nowrap text-accent">{average ?? "–"} BPM</h3>
          <PeriodNav
            label={`${formatShortDate(monday)} - ${formatShortDate(sunday)}`}
            onPrevious={() => setOffset(offset - 1)}
            onNext={() => setOffset(offset + 1)}
            canGoNext={offset < 0}
          />
        </div>
        <p className="text-body-sm text-muted">Fréquence cardiaque moyenne</p>
      </header>

      <div className="h-[262px]">
        {isLoading && <Loader />}
        {error && <p className="text-body text-accent">{error}</p>}
        {ready && average === null && <p className="text-body text-muted">Aucune séance cette semaine.</p>}
        {ready && average !== null && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={days} barGap={4} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
              <CartesianGrid vertical={false} stroke={COLORS.grid} strokeDasharray="4 4" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: COLORS.line }}
                tick={{ fill: COLORS.muted, fontSize: 12 }}
                tickMargin={16}
                height={40}
              />
              <YAxis
                domain={["dataMin - 10", "dataMax + 10"]}
                tickLine={false}
                axisLine={{ stroke: COLORS.line }}
                tick={{ fill: COLORS.muted, fontSize: 10 }}
                tickCount={4}
                allowDecimals={false}
              />
              <Tooltip content={<HeartRateTooltip />} cursor={false} />
              <Bar dataKey="min" barSize={14} radius={7} fill={COLORS.accentLight} />
              <Bar dataKey="max" barSize={14} radius={7} fill={COLORS.accent} />
              <Line
                dataKey="average"
                type="monotone"
                stroke={isHovered ? COLORS.primary : COLORS.page}
                strokeWidth={3}
                dot={{ r: 4, fill: COLORS.primary, stroke: "#ffffff", strokeWidth: 1 }}
                activeDot={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-6 flex items-center gap-4 text-body-sm text-muted">
        <LegendItem color={COLORS.accentLight} label="Min" />
        <LegendItem color={COLORS.accent} label="Max BPM" />
        <LegendItem color={COLORS.primary} label="Moyenne BPM" line />
      </p>
    </article>
  );
}
