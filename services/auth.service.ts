import { userRepository } from "@/repositories/user.repository";
import type { User } from "@prisma/client";

interface ClerkUserData {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
}

export const authService = {
  async syncUser(clerkUser: ClerkUserData): Promise<User> {
    const email = clerkUser.email_addresses[0]?.email_address;
    if (!email) throw new Error("User email is required");

    return userRepository.upsertByClerkId(
      clerkUser.id,
      {
        clerkId: clerkUser.id,
        email,
        firstName: clerkUser.first_name ?? null,
        lastName: clerkUser.last_name ?? null,
        imageUrl: clerkUser.image_url ?? null,
      },
      {
        email,
        firstName: clerkUser.first_name ?? null,
        lastName: clerkUser.last_name ?? null,
        imageUrl: clerkUser.image_url ?? null,
        lastLoginAt: new Date(),
      }
    );
  },

  async deleteUser(clerkId: string): Promise<void> {
    const user = await userRepository.findByClerkId(clerkId);
    if (user) {
      await userRepository.delete(user.id);
    }
  },

  async getUserByClerkId(clerkId: string): Promise<User | null> {
    return userRepository.findByClerkId(clerkId);
  },

  async getOrCreateUser(clerkUser: ClerkUserData): Promise<User> {
    const existing = await userRepository.findByClerkId(clerkUser.id);
    if (existing) {
      await userRepository.update(existing.id, { lastLoginAt: new Date() });
      return existing;
    }
    return this.syncUser(clerkUser);
  },
};
