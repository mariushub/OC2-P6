// Mise en forme des données de l'API avant de les afficher
import type { DayHeartRate, Session, User, UserInfo, WeekDistance } from "../types";

// L'API ne fournit pas l'objectif hebdomadaire : valeur par défaut
export const WEEKLY_GOAL = 3;

const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// ---------- Dates ----------

// "2025-01-04" → Date (au fuseau local, pour ne pas décaler d'un jour)
export function parseDate(text: string) {
  const [year, month, day] = text.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Date → "2025-01-04" (format attendu par l'API)
export function toApiDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Lundi de la semaine d'une date
export function getMonday(date: Date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); // getDay() : 0 = dimanche
  return monday;
}

// "28 mai"
export function formatShortDate(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

// "1 janvier 2025"
export function formatLongDate(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// "01.06"
function formatDayMonth(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// ---------- Nombres ----------

// 165 → "1m65"
export function formatHeight(cm: number) {
  return `${Math.floor(cm / 100)}m${String(cm % 100).padStart(2, "0")}`;
}

// 1635 → { hours: 27, minutes: 15 }
export function splitDuration(totalMinutes: number) {
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

const round1 = (value: number) => Math.round(value * 10) / 10;
const sum = (sessions: Session[], key: "distance" | "duration" | "caloriesBurned") =>
  sessions.reduce((total, session) => total + session[key], 0);

// ---------- Données des graphiques ----------

// Utilisateur + statistiques recalculées à partir des séances réelles
// (les statistiques de /api/user-info comptent aussi les séances futures)
export function formatUser(info: UserInfo, sessions: Session[]): User {
  const memberSince = parseDate(info.profile.createdAt);
  const today = new Date();
  const daysSinceSignup = Math.floor((today.getTime() - memberSince.getTime()) / 86_400_000) + 1;
  const daysWithSession = new Set(sessions.map((session) => session.date)).size;

  return {
    firstName: info.profile.firstName,
    lastName: info.profile.lastName,
    profilePicture: info.profile.profilePicture,
    age: info.profile.age,
    height: info.profile.height,
    weight: info.profile.weight,
    memberSince,
    stats: {
      totalDistance: Math.round(sum(sessions, "distance")),
      totalDuration: sum(sessions, "duration"),
      totalCalories: sum(sessions, "caloriesBurned"),
      totalSessions: sessions.length,
      restDays: Math.max(daysSinceSignup - daysWithSession, 0),
    },
  };
}

// Km parcourus chaque semaine, à partir du lundi "firstMonday"
export function getWeeklyDistances(sessions: Session[], firstMonday: Date, weeks: number): WeekDistance[] {
  return Array.from({ length: weeks }, (_, index) => {
    const start = addDays(firstMonday, index * 7);
    const end = addDays(start, 6);
    const weekSessions = sessions.filter((session) => {
      const date = parseDate(session.date);
      return date >= start && date <= end;
    });
    return {
      label: `S${index + 1}`,
      range: `${formatDayMonth(start)} au ${formatDayMonth(end)}`,
      km: round1(sum(weekSessions, "distance")),
    };
  });
}

// Fréquence cardiaque de chaque jour de la semaine qui commence le lundi "monday"
export function getDailyHeartRates(sessions: Session[], monday: Date): DayHeartRate[] {
  return DAY_NAMES.map((day, index) => {
    const date = toApiDate(addDays(monday, index));
    const daySessions = sessions.filter((session) => session.date === date);
    if (daySessions.length === 0) {
      return { day, min: null, max: null, average: null };
    }
    return {
      day,
      min: Math.min(...daySessions.map((s) => s.heartRate.min)),
      max: Math.max(...daySessions.map((s) => s.heartRate.max)),
      average: Math.round(daySessions.reduce((total, s) => total + s.heartRate.average, 0) / daySessions.length),
    };
  });
}

// Moyenne de la fréquence cardiaque sur des séances (null si aucune)
export function getAverageHeartRate(sessions: Session[]) {
  if (sessions.length === 0) return null;
  return Math.round(sessions.reduce((total, s) => total + s.heartRate.average, 0) / sessions.length);
}

// Résumé d'une semaine : nombre de courses, durée, distance
export function getWeekSummary(sessions: Session[]) {
  return {
    count: sessions.length,
    duration: sum(sessions, "duration"),
    distance: round1(sum(sessions, "distance")),
  };
}
