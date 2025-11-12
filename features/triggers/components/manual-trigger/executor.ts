import { NodeExecutor } from "@/features/executions/types";
import { Realtime } from "@inngest/realtime";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { httpRequestChannel } from "@/inngest/channels/http-request";
type ManualTriggerData = Record<string, unknown>;

const emitStatus = async (
  publish: Realtime.PublishFn,
  nodeId: string,
  status: "loading" | "success" | "error"
) => {
  await publish(
    manualTriggerChannel().status({
      nodeId,
      status,
    })
  );
};

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  await emitStatus(publish, nodeId, "loading");
  const result = await step.run("manual-trigger", async () => context);
  await emitStatus(publish, nodeId, "success");
  return result;
};
