import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS } from "@/lib/constants";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashApiKey(key: string): Promise<string> {
  return bcrypt.hash(key, 10);
}

export async function verifyApiKey(
  key: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(key, hash);
}
