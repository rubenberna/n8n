import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ step }) => {
    await step.sleep("wait-a-moment", "1s");
    await step.run("create-workflow", async () => {
      await prisma.workflow.create({
        data: {
          name: "New Workflow",
          description: "New Workflow Description",
        },
      });
    });
    return { success: true, message: "Job queued" };
  }
);
