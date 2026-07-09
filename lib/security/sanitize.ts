export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
    return parsed.toString();
  } catch {
    throw new Error("Invalid URL format");
  }
}

export function normalizeUrl(url: string): string {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  return sanitizeUrl(normalized);
}
