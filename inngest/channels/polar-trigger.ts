import { channel, topic } from "@inngest/realtime";

export const POLAR_TRIGGER_CHANNEL_NAME = "polar-trigger-execution";

export const polarTriggerChannel = channel(POLAR_TRIGGER_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
