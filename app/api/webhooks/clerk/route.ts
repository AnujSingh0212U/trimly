import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { authService } from "@/services/auth.service";

export async function POST(request: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated":
      await authService.syncUser({
        id: evt.data.id!,
        email_addresses: (evt.data.email_addresses ?? []).map((e) => ({
          email_address: e.email_address,
        })),
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
        image_url: evt.data.image_url,
      });
      break;
    case "user.deleted":
      if (evt.data.id) {
        await authService.deleteUser(evt.data.id);
      }
      break;
  }

  return new Response("OK", { status: 200 });
}
