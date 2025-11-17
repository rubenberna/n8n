"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { polarTriggerChannel } from "@/inngest/channels/polar-trigger";

export type PolarRegistryToken = Realtime.Token<
  typeof polarTriggerChannel,
  ["status"]
>;

export async function fetchPolarTriggerRealtimeToken(): Promise<PolarRegistryToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: polarTriggerChannel(),
    topics: ["status"],
  });
  return token as PolarRegistryToken;
}
