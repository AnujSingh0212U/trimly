import { Suspense } from "react";
import PasswordGateContent from "./gate-content";

export default function PasswordGatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <PasswordGateContent params={params} />
    </Suspense>
  );
}
