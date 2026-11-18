import Skeleton from "../components/Skeleton";
import UserCard from "../components/UserCard";
import { useUser } from "../context/UserContext";
import { formatHeight } from "../utils/format";

export function meta() {
  return [{ title: "Mon profil - SportSee" }];
}

export default function Profile() {
  const user = useUser(); // null tant que les données chargent → skeletons

  return (
    <>
      <h1 className="sr-only">Mon profil</h1>

      <div className="grid grid-cols-[508fr_575fr] items-start gap-[57px]">
        {/* Colonne de gauche : identité + profil (lus dans le UserContext) */}
        <div className="flex flex-col gap-4">
          <section className="rounded-card bg-white py-6 pr-[52px] pl-8 shadow-card">
            <UserCard />
          </section>

          <section className="flex flex-col gap-8 rounded-card bg-white px-7 pt-10 pb-[60px] shadow-card">
            <h2 className="border-b border-silver pb-6 text-h4">Votre profil</h2>
            {/* Le genre est dans la maquette, mais l'API ne le renvoie pas */}
            {user ? (
              <ul className="flex flex-col gap-6 text-body-lg text-muted">
                <li>Âge : {user.age}</li>
                <li>Taille : {formatHeight(user.height)}</li>
                <li>Poids : {user.weight}kg</li>
              </ul>
            ) : (
              <div className="flex flex-col gap-6">
                <Skeleton className="h-[19px] w-24" />
                <Skeleton className="h-[19px] w-32" />
                <Skeleton className="h-[19px] w-28" />
              </div>
            )}
          </section>
        </div>

        {/* Colonne de droite : statistiques (étape des graphiques) */}
        <section className="flex flex-col gap-8">
          <h2 className="text-h4">Vos statistiques</h2>
          <p className="text-body text-muted">À venir.</p>
        </section>
      </div>
    </>
  );
}
