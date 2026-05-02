export const isDemoMode = (): boolean =>
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEMO_ADMIN_ACCOUNT = {
  username: "arisbara",
  password: "arisbara",
} as const;

export const DEMO_USER_ACCOUNT = {
  username: "demo.user",
  password: "demo123",
} as const;

