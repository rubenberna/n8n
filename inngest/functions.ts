import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db/db";
import { NodeType } from "@/lib/generated/prisma/enums";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is required");
    }
    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });
    // Initialize context with any initial data from the trigger

    let context = event.data.initialData || {};
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        context,
        nodeId: node.id,
        step,
        publish,
      });
    }

    return {
      workflowId,
      result: context,
    };
  }
);
