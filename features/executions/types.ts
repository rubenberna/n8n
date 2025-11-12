import type { GetStepTools, Inngest } from "inngest";
import type { Realtime } from "@inngest/realtime";

export type WorkflowContext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

// This is a very dynamic interface that can be used to pass in any data to the node executor. We don't know what the data will be, so we use a generic type.
export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  context: WorkflowContext;
  nodeId: string;
  step: StepTools;
  publish: Realtime.PublishFn;
}

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>
) => Promise<WorkflowContext>;
