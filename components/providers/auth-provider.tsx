"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { HAS_CLERK, getClerkPublishableKey } from "@/lib/clerk";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = getClerkPublishableKey();

  if (!HAS_CLERK || !publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}
