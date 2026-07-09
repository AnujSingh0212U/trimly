import { customAlphabet } from "nanoid";
import { DEFAULT_SLUG_LENGTH } from "@/lib/constants";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const generateId = customAlphabet(alphabet, DEFAULT_SLUG_LENGTH);

export function generateSlug(length = DEFAULT_SLUG_LENGTH): string {
  if (length === DEFAULT_SLUG_LENGTH) return generateId();
  return customAlphabet(alphabet, length)();
}

export function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

export function isValidSlugFormat(slug: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}
