import Handlebars from "handlebars";
import type { NodeExecutor } from "@/inngest/types";
import { NonRetriableError } from "inngest";
import { deepseekChannel } from "@/inngest/channels";
import type { AVAILABLE_MODELS } from "./dialog";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { env } from "@/env";
import { generateText } from "ai";

type DeepSeekData = {
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

export const DeepSeekExecutor: NodeExecutor = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const deepseekData = data as DeepSeekData;

  await publish(
    deepseekChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );
  if (!deepseekData.variable) {
    await publish(
      deepseekChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Variable name is not defined.");
  }

  if (!deepseekData.userPrompt) {
    await publish(
      deepseekChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("User prompt is missing.");
  }
  const systemPromptData = deepseekData.systemPrompt
    ? Handlebars.compile(deepseekData.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPromptData = Handlebars.compile(deepseekData.userPrompt)(context);
  const credentials = env.DEEPSEEK_API_KEY;
  const deepseek = createDeepSeek({
    apiKey: credentials,
  });
  try {
    const { steps } = await step.ai.wrap(
      "generate-text-deepseek",
      generateText,
      {
        model: deepseek(deepseekData.model || "deepseek-chat"),
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
      deepseekChannel().status({
        nodeId: nodeId,
        status: "success",
      })
    );
    return {
      ...context,
      [deepseekData.variable]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(
      deepseekChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
