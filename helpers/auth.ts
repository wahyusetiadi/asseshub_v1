export type AppRole = "ADMIN" | "USER";

export interface SessionUser {
  id: string;
  username: string;
  role: AppRole | string;
  position?: string;
  [key: string]: unknown;
}

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

const USER_APP_PREFIXES = ["/dashboard", "/exam", "/result-exam"];
const ADMIN_APP_PREFIXES = [
  "/admin-dashboard",
  "/tests",
  "/candidates",
  "/results",
  "/invitations",
];

const isClient = () => typeof window !== "undefined";

export const getStoredToken = (): string | null => {
  if (!isClient()) return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setStoredToken = (token: string): void => {
  if (!isClient()) return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const getStoredUser = (): SessionUser | null => {
  if (!isClient()) return null;

  const rawUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as SessionUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const setStoredUser = (user: SessionUser): void => {
  if (!isClient()) return;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearSession = (): void => {
  if (!isClient()) return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (normalizedPayload.length % 4)) % 4;
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + padding,
      "="
    );

    const decoded = JSON.parse(atob(paddedPayload));
    if (typeof decoded !== "object" || decoded === null) return null;

    return decoded as Record<string, unknown>;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;

  if (typeof exp !== "number") {
    return false;
  }

  return Date.now() >= exp * 1000;
};

export const getHomeRouteByRole = (role?: string | null): string => {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "USER") return "/dashboard";
  return "/login";
};

export const getLoginRouteByRole = (role?: string | null): string => {
  if (role === "USER") return "/users";
  return "/login";
};

const matchesRoutePrefix = (
  pathname: string,
  prefixes: readonly string[]
): boolean =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

export const getLoginRouteForPathname = (
  pathname: string,
  fallbackRole?: string | null
): string => {
  if (matchesRoutePrefix(pathname, USER_APP_PREFIXES)) {
    return "/users";
  }

  if (matchesRoutePrefix(pathname, ADMIN_APP_PREFIXES)) {
    return "/login";
  }

  return getLoginRouteByRole(fallbackRole);
};
