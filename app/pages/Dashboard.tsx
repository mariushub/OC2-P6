import UserCard from "../components/UserCard";

export function meta() {
  return [{ title: "Dashboard - SportSee" }];
}

export default function Dashboard() {
  return (
    <div className="mx-auto flex max-w-[1052px] flex-col">
      <h1 className="sr-only">Dashboard</h1>

      {/* Bandeau : profil de l'utilisateur connecté (lu dans le UserContext) */}
      <section className="flex items-center justify-between gap-6 rounded-panel bg-linear-to-t from-white/0 to-white px-[52px] py-8">
        <UserCard className="gap-[38px]" />
      </section>

      <p className="mt-[108px] text-body text-muted">Graphiques à venir.</p>
    </div>
  );
}
