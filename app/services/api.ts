// Accès aux données de l'API SportSee.
// Pour l'instant, ces fonctions renvoient les données mockées (app/mocks) :
// le vrai backend sera branché ici plus tard, sans changer les composants.
import { mockLogin, mockUserActivity, mockUserInfo } from "../mocks/mockApi";
import type { LoginResponse, Session, UserInfo } from "../types";

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
