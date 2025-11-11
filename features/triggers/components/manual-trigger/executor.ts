import { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData = Record<string, unknown>;
export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({ context, nodeId, step }) => {

  // Publish 'loading' state for manual trigger

  const result = await step.run("manual-trigger", async () => context);

  // Publish "success" state for manual trigger
  return result;

};