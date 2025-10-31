import { inngest } from "./client";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ step }) => {
    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
    });
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai("gpt-3.5-turbo"),
      system: "You are a helpful assistant.",
      prompt: "What is 2 + 2",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    return steps;
  }
);
