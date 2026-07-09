import { auth } from "@clerk/nextjs/server";
import { authService } from "@/services/auth.service";
import { ForbiddenError, UnauthorizedError } from "@/lib/api/errors";
import { isClerkConfigured } from "@/lib/clerk";
import type { User } from "@prisma/client";
export async function getAuthUser(): Promise<User> {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new UnauthorizedError();

  let user = await authService.getUserByClerkId(clerkId);
  if (!user) {
    const clerkUser = await (await import("@clerk/nextjs/server")).currentUser();
    if (!clerkUser) throw new UnauthorizedError();
    user = await authService.syncUser({
      id: clerkUser.id,
      email_addresses: clerkUser.emailAddresses.map((e) => ({
        email_address: e.emailAddress,
      })),
      first_name: clerkUser.firstName,
      last_name: clerkUser.lastName,
      image_url: clerkUser.imageUrl,
    });
  }

  if (user.status === "SUSPENDED") {
    throw new ForbiddenError("Your account has been suspended");
  }

  return user;
}

export async function getOptionalAuthUser(): Promise<User | null> {
  if (!isClerkConfigured()) return null;
  try {
    return await getAuthUser();
  } catch {
    return null;
  }
}
export async function requireAdmin(): Promise<User> {
  const user = await getAuthUser();
  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }
  return user;
}
