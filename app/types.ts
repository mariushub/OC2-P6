// Forme des données renvoyées par l'API (backend)

// POST /api/login
export type LoginResponse = {
  token: string;
  userId: string;
};

// GET /api/user-info
export type UserInfo = {
  profile: {
    firstName: string;
    lastName: string;
    createdAt: string; // "2025-01-01"
    age: number;
    weight: number; // kg
    height: number; // cm
    profilePicture: string; // URL
  };
  statistics: {
    totalDistance: string; // ⚠ texte, ex. "2250.2" (km)
    totalSessions: number;
    totalDuration: number; // minutes
  };
};

// GET /api/user-activity → tableau de séances
export type Session = {
  date: string; // "2025-01-04"
  distance: number; // km
  duration: number; // minutes
  heartRate: { min: number; max: number; average: number };
  caloriesBurned: number;
};

// ----- Données mises en forme pour l'affichage (voir utils/format.ts) -----

// Utilisateur connecté, partagé par le UserContext
export type User = {
  firstName: string;
  lastName: string;
  profilePicture: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  memberSince: Date;
  stats: {
    totalDistance: number; // km
    totalDuration: number; // minutes
    totalCalories: number;
    totalSessions: number;
    restDays: number;
  };
};

// Une barre du graphique "km par semaine"
export type WeekDistance = {
  label: string; // "S1"
  range: string; // "01.06 au 07.06" (info-bulle)
  km: number;
};

// Un jour du graphique "fréquence cardiaque" (null = pas de séance ce jour-là)
export type DayHeartRate = {
  day: string; // "Lun"
  min: number | null;
  max: number | null;
  average: number | null;
};
