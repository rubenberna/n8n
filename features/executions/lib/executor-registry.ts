import { NodeType } from "@/lib/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFormExecutor } from "@/features/triggers/components/google-form-trigger/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormExecutor,
};

export const getExecutor = (nodeType: NodeType): NodeExecutor => {
  const executor = executorRegistry[nodeType];
  if (!executor) {
    throw new Error(`Executor for node type ${nodeType} not found`);
  }
  return executor;
};
