import achievementIcon from "../assets/icons/icon-achievement.svg";
import DistanceChart from "../components/DistanceChart";
import HeartRateChart from "../components/HeartRateChart";
import StatCard from "../components/StatCard";
import UserCard from "../components/UserCard";
import WeeklyGoalChart from "../components/WeeklyGoalChart";
import { useUser } from "../context/UserContext";
import { useApi } from "../hooks/useApi";
import { getUserActivity } from "../services/api";
import { addDays, getMonday, getWeekSummary, toApiDate } from "../utils/format";
import Loader from "../components/Loader";
import Skeleton from "../components/Skeleton";
import { useEffect } from "react";

export function meta() {
  return [{ title: "Dashboard - SportSee" }];
}

export default function Dashboard() {
  const user = useUser(); // null tant que les données chargent → skeletons

  // Séances de la semaine en cours (section "Cette semaine")
  const monday = getMonday(new Date());
  const sunday = addDays(monday, 6);
  const start = toApiDate(monday);
  const end = toApiDate(sunday);
  const { data: sessions, isLoading, error } = useApi(getUserActivity, start, end);
  const week = sessions && !isLoading && !error ? getWeekSummary(sessions) : null;

  return (
    <div className="mx-auto flex max-w-[1052px] flex-col">
      <h1 className="sr-only">Dashboard</h1>

      {/* Bandeau : profil + distance totale */}
      <section className="flex items-center justify-between gap-6 rounded-panel bg-linear-to-t from-white/0 to-white px-[52px] py-8">
        <UserCard className="gap-[38px]" />
        <div className="flex items-center gap-[18px]">
          <p className="text-body text-muted">Distance totale parcourue</p>
          <div className="flex h-[90px] w-[183px] shrink-0 items-center justify-center rounded-card bg-primary">
            {user ? (
              <div className="flex animate-reveal items-center gap-[19px]">
                <img src={achievementIcon} alt="" className="size-[34px]" />
                <span className="text-h4 whitespace-nowrap text-white">{user.stats.totalDistance} km</span>
              </div>
            ) : (
              <Skeleton light className="h-[27px] w-28" />
            )}
          </div>
        </div>
      </section>

      {/* Dernières performances */}
      <section className="mt-[108px] flex flex-col gap-8">
        <h2 className="text-h4">Vos dernières performances</h2>
        <div className="grid grid-cols-[445fr_583fr] gap-6">
          <DistanceChart />
          <HeartRateChart />
        </div>
      </section>

      {/* Cette semaine */}
      <section className="mt-[71px] flex flex-col gap-8">
        <div className="flex flex-col gap-[9px]">
          <h2 className="text-h4">Cette semaine</h2>
          <p className="text-body-lg text-muted">
            Du {monday.toLocaleDateString("fr-FR")} au {sunday.toLocaleDateString("fr-FR")}
          </p>
        </div>

        {isLoading && <Loader label="Chargement de vos séances…" className="h-[342px]" />}
        {error && <p className="text-body text-accent">{error}</p>}

        {week && (
          <div className="grid grid-cols-[450fr_572fr] items-start gap-[30px]">
            <WeeklyGoalChart done={week.count} />
            <div className="flex flex-col gap-4">
              <StatCard label="Durée d’activité" value={week.duration} unit="minutes" />
              <StatCard label="Distance" value={week.distance} unit="kilomètres" tone="accent" />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
