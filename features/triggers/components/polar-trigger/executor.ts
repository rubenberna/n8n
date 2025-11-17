import { NodeExecutor } from "@/features/executions/types";
import { Realtime } from "@inngest/realtime";
import { polarTriggerChannel } from "@/inngest/channels/polar-trigger";

type PolarTriggerData = Record<string, unknown>;

const emitStatus = async (
  publish: Realtime.PublishFn,
  nodeId: string,
  status: "loading" | "success" | "error"
) => {
  await publish(
    polarTriggerChannel().status({
      nodeId,
      status,
    })
  );
};

export const polarTriggerExecutor: NodeExecutor<PolarTriggerData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  await emitStatus(publish, nodeId, "loading");
  const result = await step.run("polar-trigger", async () => context);
  await emitStatus(publish, nodeId, "success");
  return result;
};
