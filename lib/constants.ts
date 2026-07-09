export const APP_NAME = "Trimly";
export const APP_TAGLINE = "Short links. Smart analytics. Built for teams.";

function resolveAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const APP_URL = resolveAppUrl();

export const DEFAULT_SLUG_LENGTH = 7;
export const MAX_SLUG_LENGTH = 32;
export const MIN_SLUG_LENGTH = 3;
export const MAX_COLLISION_RETRIES = 5;
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? "12", 10);

export const PAGINATION_DEFAULT_LIMIT = 10;
export const PAGINATION_MAX_LIMIT = 100;

export const GUEST_SESSION_COOKIE = "trimly_guest_session";
export const GUEST_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
