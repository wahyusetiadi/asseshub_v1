import { getStoredToken, getStoredUser, setStoredToken, setStoredUser } from "@/helpers/auth";
import type { SessionUser } from "@/helpers/auth";
import { ApiError } from "../utils/errorHandler";
import { getDemoDb } from "./demoDb";

const base64UrlEncode = (json: unknown): string => {
  const raw = typeof json === "string" ? json : JSON.stringify(json);
  const b64 = btoa(raw);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

export const createDemoToken = (payload: Record<string, unknown>): string => {
  const header = base64UrlEncode({ alg: "none", typ: "JWT" });
  const body = base64UrlEncode(payload);
  return `${header}.${body}.demo`;
};

const storeDemoSession = (user: SessionUser): string => {
  const token = createDemoToken({
    sub: user.id,
    role: user.role,
    username: user.username,
  });
  setStoredToken(token);
  setStoredUser(user);
  return token;
};

export const demoLoginAdmin = async (username: string, password: string) => {
  const db = getDemoDb();
  const admin = db.admins.find(
    (u) => u.username === username && u.password === password
  );
  if (!admin) {
    throw new ApiError("Username atau password salah", 401);
  }

  const token = storeDemoSession({
    id: admin.id,
    username: admin.username,
    role: admin.role,
    name: admin.name,
    email: admin.email,
  });

  return { data: { token }, status: 200, message: "OK" };
};

export const demoLoginUser = async (username: string, password: string) => {
  const db = getDemoDb();
  const candidate = db.candidates.find(
    (u) => u.username === username && u.password === password
  );
  if (!candidate) {
    throw new ApiError("Username atau password salah", 401);
  }

  const token = storeDemoSession({
    id: candidate.id,
    username: candidate.username,
    role: "USER",
    position: candidate.position,
    name: candidate.name,
    email: candidate.email,
  });

  return { data: { token }, status: 200, message: "OK" };
};

export const demoGetMe = async () => {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    throw new ApiError("Unauthorized", 401);
  }

  return { data: user, status: 200, message: "OK" };
};
