export const isDemoMode = (): boolean =>
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEMO_ADMIN_ACCOUNT = {
  username: "admin",
  password: "admin",
} as const;

export const DEMO_USER_ACCOUNT = {
  username: "candidate",
  password: "candidate",
} as const;

