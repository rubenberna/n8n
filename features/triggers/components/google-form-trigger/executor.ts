import { NodeExecutor } from "@/features/executions/types";
import { Realtime } from "@inngest/realtime";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
type GoogleFormData = Record<string, unknown>;

const emitStatus = async (
  publish: Realtime.PublishFn,
  nodeId: string,
  status: "loading" | "success" | "error"
) => {
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status,
    })
  );
};

export const googleFormExecutor: NodeExecutor<GoogleFormData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  await emitStatus(publish, nodeId, "loading");
  const result = await step.run("google-form-trigger", async () => context);
  await emitStatus(publish, nodeId, "success");
  return result;
};
