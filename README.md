# SportSee - Frontend

Tableau de bord sportif en React (Create React Router, TypeScript, Tailwind).

## Lancer le projet

1. **Le backend** fourni par OpenClassrooms ([P6JS](https://github.com/OpenClassrooms-Student-Center/P6JS)). Il faut Node 22 : le backend ne démarre pas avec Node 26.

   ```bash
   git clone https://github.com/OpenClassrooms-Student-Center/P6JS.git backend
   cd backend
   npm install
   npx -y node@22 app/index.js
   ```

   L'API tourne sur http://localhost:8000

2. **Le frontend** (dans ce dossier) :

   ```bash
   npm install
   npm run dev
   ```

   L'application tourne sur http://localhost:5173

Comptes de test : `sophiemartin` / `password123`, `emmaleroy` / `password789`, `marcdubois` / `password456`

### Sans le backend : données mockées

```bash
npm run dev:mock
```

Les fonctions de `services/api.ts` renvoient alors les fausses données de `app/mocks/` au lieu d'appeler le backend (mêmes comptes de test). Aucun composant ne change : seul le service choisit la source des données.

### Version de production

```bash
npm run build
npm start
```

## Organisation

```
app/
├── routes.ts            ← la liste des routes
├── root.tsx             ← squelette HTML + AuthProvider + page d'erreur
├── pages/               ← une page = un fichier (Login, Dashboard, Profile, NotFound)
├── components/          ← Header, Footer, Logo (+ LogoIcon animé), ProtectedLayout (vérifie la connexion),
│                          UserCard, StatCard, PeriodNav,
│                          DistanceChart, HeartRateChart, WeeklyGoalChart (graphiques Recharts)
├── context/             ← AuthContext (session) et UserContext (infos de l'utilisateur)
├── services/api.ts      ← tous les appels à l'API + gestion des erreurs + choix API / mock
├── hooks/useApi.ts      ← hook pour appeler l'API depuis un composant (chargement, erreur)
├── utils/format.ts      ← mise en forme des données de l'API pour les graphiques et les statistiques
├── mocks/               ← fausses réponses de l'API (JSON) + mockApi.ts, utilisés avec npm run dev:mock
├── types.ts             ← forme des données de l'API et des données mises en forme
├── theme.ts             ← couleurs de la maquette pour Recharts
├── app.css              ← Tailwind + couleurs, typos et animations de la maquette
└── assets/              ← logo, icônes, images
```

## Authentification

- La connexion envoie l'identifiant et le mot de passe à `POST /api/login`, qui renvoie un token JWT.
- Le token est stocké dans un cookie (24 h, `SameSite=Strict`) et partagé dans l'application avec le Context API (`useAuth()`).
- Les pages protégées passent par `ProtectedLayout`, dont le `clientLoader` renvoie vers la connexion s'il n'y a pas de token (`throw redirect("/")`).

## État global (Context API)

| Contexte | Contient | Utilisé par |
|---|---|---|
| `AuthContext` (`useAuth()`) | token, `login()`, `logout()` | toute l'application |
| `UserContext` (`useUser()`) | profil + statistiques de l'utilisateur, chargés une fois | Dashboard, Profil |

Les séances (`/api/user-activity`) ne sont pas dans un contexte : elles ne servent qu'aux graphiques du Dashboard.

## Appels à l'API

- `services/api.ts` contient une fonction par route de l'API (`login`, `getUserInfo`, `getUserActivity`). Le token est envoyé dans l'en-tête `Authorization: Bearer <token>`.
- En cas de problème, ces fonctions lancent une `ApiError` avec le code HTTP : 0 si le serveur est injoignable, 401/403 si le token est refusé, 500…
- Les composants passent par le hook `useApi()`. Il récupère le token lui-même : on lui donne la fonction du service et ses autres paramètres, il renvoie `{ data, isLoading, error }` :

  ```tsx
  const { data: user } = useApi(getUserData);                         // getUserData(token)
  const { data: sessions } = useApi(getUserActivity, start, end);     // getUserActivity(token, start, end)
  ```

  L'appel est relancé automatiquement quand un paramètre change (ex. : `start` et `end` quand on change de semaine).

- Si l'API refuse le token (faux ou expiré), `useApi()` déconnecte l'utilisateur et le renvoie vers la connexion.

## Graphiques et statistiques

Les séances brutes de l'API sont transformées par `utils/format.ts` avant l'affichage :

| Affichage | Fonction | Donnée |
|---|---|---|
| Graphique km (4 semaines, ‹ ›) | `getWeeklyDistances()` | km par semaine, moyenne, info-bulle « 01.06 au 07.06 » |
| Graphique BPM (1 semaine, ‹ ›) | `getDailyHeartRates()` | min / max / moyenne par jour |
| Anneau « Cette semaine » | `getWeekSummary()` | courses, durée, distance de la semaine |
| Statistiques (Profil, distance totale) | `formatUser()` | recalculées à partir des séances réelles |

Points d'attention sur l'API :
- Les statistiques de `/api/user-info` comptent aussi les séances futures (les données vont jusqu'en 2029) : elles sont donc recalculées à partir de `/api/user-activity`, de l'inscription jusqu'à aujourd'hui.
- L'API ne fournit ni l'objectif hebdomadaire (valeur par défaut : `WEEKLY_GOAL = 3`) ni le genre (non affiché).
- Jours de repos = jours depuis l'inscription sans aucune séance.
