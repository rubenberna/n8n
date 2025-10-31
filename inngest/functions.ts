import { inngest } from "./client";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ step }) => {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai("gpt-4o-mini"),
      system: "You are a helpful assistant.",
      prompt: "What is 2 + 2",
    });

    return steps;
  }
);
