const PLACEHOLDER_MARKERS = ["blakhole.com", "placeholder", "informantprint"];

function decodeClerkKeyPayload(key: string): string {
  try {
    const b64 = key.replace(/^(pk|sk)_(test|live)_/, "");
    if (typeof atob !== "undefined") {
      return atob(b64);
    }
    return Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return "";
  }
}

function isPlaceholderClerkKey(key?: string | null): boolean {
  if (!key) return true;
  const lower = key.toLowerCase();
  if (PLACEHOLDER_MARKERS.some((marker) => lower.includes(marker))) {
    return true;
  }
  const payload = decodeClerkKeyPayload(key).toLowerCase();
  return PLACEHOLDER_MARKERS.some((marker) => payload.includes(marker));
}

export function isValidClerkPublishableKey(key?: string | null): boolean {
  return Boolean(key && key.length > 20 && !isPlaceholderClerkKey(key));
}

export function isValidClerkSecretKey(key?: string | null): boolean {
  return Boolean(key && key.length > 20 && !isPlaceholderClerkKey(key));
}

export function isClerkConfigured(): boolean {
  return (
    isValidClerkPublishableKey(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    isValidClerkSecretKey(process.env.CLERK_SECRET_KEY)
  );
}

export const HAS_CLERK = isValidClerkPublishableKey(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

export function getClerkPublishableKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return isValidClerkPublishableKey(key) ? key : undefined;
}
