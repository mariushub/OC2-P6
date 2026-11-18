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
