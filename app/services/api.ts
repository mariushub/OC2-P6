// Tous les appels à l'API SportSee
import { mockLogin, mockUserActivity, mockUserInfo } from "../mocks/mockApi";
import type { LoginResponse, Session, UserInfo } from "../types";
import { formatUser, toApiDate } from "../utils/format";

const API_URL = "http://localhost:8000";

// true avec "npm run dev:mock" : les fonctions ci-dessous renvoient les fausses données de app/mocks
// au lieu d'appeler le backend. Les composants ne changent pas.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
  
// Erreur renvoyée par l'API, avec son code HTTP (0 = serveur injoignable)
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Envoie une requête et renvoie la réponse en JSON, ou lance une ApiError
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new ApiError(0, "Impossible de contacter le serveur.");
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new ApiError(response.status, "Session expirée, veuillez vous reconnecter.");
    }
    throw new ApiError(response.status, `Erreur du serveur (${response.status}).`);
  }

  return response.json();
}

// En-tête d'authentification à envoyer avec le token
function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

// Mode mock : un token inconnu donne la même erreur que l'API
function fromMock<T>(data: T | null): T {
  if (data === null) throw new ApiError(403, "Session expirée, veuillez vous reconnecter.");
  return data;
}

// POST /api/login
export async function login(username: string, password: string) {
  if (USE_MOCK) {
    const data = mockLogin(username, password);
    if (!data) throw new ApiError(401, "Identifiant ou mot de passe incorrect.");
    return data;
  }
  return request<LoginResponse>("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

// GET /api/user-info : profil + statistiques
export async function getUserInfo(token: string) {
  if (USE_MOCK) return fromMock(mockUserInfo(token));
  return request<UserInfo>("/api/user-info", authHeader(token));
}

// GET /api/user-activity : séances entre deux dates ("YYYY-MM-DD")
export async function getUserActivity(token: string, startWeek: string, endWeek: string) {
  if (USE_MOCK) return fromMock(mockUserActivity(token, startWeek, endWeek));
  return request<Session[]>(
    `/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    authHeader(token),
  );
}

// Profil + statistiques de l'utilisateur connecté, mis en forme pour l'affichage
// (statistiques calculées à partir de toutes ses séances depuis l'inscription)
export async function getUserData(token: string) {
  const info = await getUserInfo(token);
  const sessions = await getUserActivity(token, info.profile.createdAt, toApiDate(new Date()));
  return formatUser(info, sessions);
}
