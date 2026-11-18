// Accès aux données de l'API SportSee.
// Pour l'instant, ces fonctions renvoient les données mockées (app/mocks) :
// le vrai backend sera branché ici plus tard, sans changer les composants.
import { mockLogin, mockUserActivity, mockUserInfo } from "../mocks/mockApi";
import type { LoginResponse, Session, UserInfo } from "../types";
import { formatUser, toApiDate } from "../utils/format";

// Erreur renvoyée par l'API, avec son code HTTP
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Un token inconnu donne la même erreur que l'API
function fromMock<T>(data: T | null): T {
  if (data === null) throw new ApiError(403, "Session expirée, veuillez vous reconnecter.");
  return data;
}

// POST /api/login
export async function login(username: string, password: string): Promise<LoginResponse> {
  const data = mockLogin(username, password);
  if (!data) throw new ApiError(401, "Identifiant ou mot de passe incorrect.");
  return data;
}

// GET /api/user-info : profil + statistiques
export async function getUserInfo(token: string): Promise<UserInfo> {
  return fromMock(mockUserInfo(token));
}

// GET /api/user-activity : séances entre deux dates ("YYYY-MM-DD")
export async function getUserActivity(token: string, startWeek: string, endWeek: string): Promise<Session[]> {
  return fromMock(mockUserActivity(token, startWeek, endWeek));
}

// Profil + statistiques de l'utilisateur connecté, mis en forme pour l'affichage
// (statistiques calculées à partir de toutes ses séances depuis l'inscription)
export async function getUserData(token: string) {
  const info = await getUserInfo(token);
  const sessions = await getUserActivity(token, info.profile.createdAt, toApiDate(new Date()));
  return formatUser(info, sessions);
}
