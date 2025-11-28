import Handlebars from "handlebars";
import type { NodeExecutor } from "@/inngest/types";
import { NonRetriableError } from "inngest";
import { anthropicChannel } from "@/inngest/channels";
import type { AVAILABLE_MODELS } from "./dialog";
import { createAnthropic } from "@ai-sdk/anthropic";
import { env } from "@/env";
import { generateText } from "ai";

type AnthropicData = {
  variable?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

Handlebars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export const AnthropicExecutor: NodeExecutor = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const anthropicData = data as AnthropicData;

  await publish(
    anthropicChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );
  if (!anthropicData.variable) {
    await publish(
      anthropicChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Variable name is not defined.");
  }

  if (!anthropicData.userPrompt) {
    await publish(
      anthropicChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("User prompt is missing.");
  }
  const systemPromptData = anthropicData.systemPrompt
    ? Handlebars.compile(anthropicData.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPromptData = Handlebars.compile(anthropicData.userPrompt)(context);
  const credentials = env.ANTHROPIC_API_KEY;
  const anthropic = createAnthropic({
    apiKey: credentials,
  });
  try {
    const { steps } = await step.ai.wrap(
      "generate-text-anthropic",
      generateText,
      {
        model: anthropic(anthropicData.model || "claude-sonnet-4-20250514"),
        system: systemPromptData,
        prompt: userPromptData,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    const text =
      steps[0]?.content[0]?.type === "text" ? steps[0].content[0].text : "";
    await publish(
      anthropicChannel().status({
        nodeId: nodeId,
        status: "success",
      })
    );
    return {
      ...context,
      [anthropicData.variable]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(
      anthropicChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
