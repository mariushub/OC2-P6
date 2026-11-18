// Fausses réponses de l'API, utilisées avec "npm run dev:mock" (pas besoin du backend)
import type { LoginResponse, Session, UserInfo } from "../types";
import { toApiDate } from "../utils/format";
import userActivityData from "./user-activity.json";
import userInfoData from "./user-info.json";

// Les 3 comptes de démo (les mêmes que dans le backend)
const ACCOUNTS = [
  { username: "sophiemartin", password: "password123", userId: "user123" },
  { username: "emmaleroy", password: "password789", userId: "user789" },
  { username: "marcdubois", password: "password456", userId: "user456" },
];

const usersInfo: Record<string, UserInfo> = userInfoData;
const usersActivity: Record<string, Session[]> = userActivityData;

// Le faux token "mock-user123" contient l'identifiant de l'utilisateur
const userIdFromToken = (token: string) => token.replace("mock-", "");

// Faux POST /api/login (null = identifiants incorrects)
export function mockLogin(username: string, password: string): LoginResponse | null {
  const account = ACCOUNTS.find((a) => a.username === username && a.password === password);
  if (!account) return null;
  return { token: `mock-${account.userId}`, userId: account.userId };
}

// Faux GET /api/user-info (null = token inconnu)
export function mockUserInfo(token: string): UserInfo | null {
  return usersInfo[userIdFromToken(token)] ?? null;
}

// Faux GET /api/user-activity : même règle que le backend (entre les deux dates, sans le futur)
export function mockUserActivity(token: string, startWeek: string, endWeek: string): Session[] | null {
  const sessions = usersActivity[userIdFromToken(token)];
  if (!sessions) return null;
  const today = toApiDate(new Date());
  return sessions.filter((s) => s.date >= startWeek && s.date <= endWeek && s.date <= today);
}
