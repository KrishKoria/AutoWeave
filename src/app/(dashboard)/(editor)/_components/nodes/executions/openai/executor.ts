import Handlebars from "handlebars";
import type { NodeExecutor } from "@/inngest/types";
import { NonRetriableError } from "inngest";
import { openAIChannel } from "@/inngest/channels";
import type { AVAILABLE_MODELS } from "./dialog";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/env";
import { generateText } from "ai";

type OpenAIData = {
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

export const OpenAIExecutor: NodeExecutor = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const openaiData = data as OpenAIData;

  await publish(
    openAIChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );
  if (!openaiData.variable) {
    await publish(
      openAIChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Variable name is not defined.");
  }

  if (!openaiData.userPrompt) {
    await publish(
      openAIChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("User prompt is missing.");
  }
  const systemPromptData = openaiData.systemPrompt
    ? Handlebars.compile(openaiData.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPromptData = Handlebars.compile(openaiData.userPrompt)(context);
  const credentials = env.OPENAI_API_KEY;
  const openai = createOpenAI({
    apiKey: credentials,
  });
  try {
    const { steps } = await step.ai.wrap("generate-text-openai", generateText, {
      model: openai(openaiData.model || "gpt-4.1"),
      system: systemPromptData,
      prompt: userPromptData,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });
    const text =
      steps[0]?.content[0]?.type === "text" ? steps[0].content[0].text : "";
    await publish(
      openAIChannel().status({
        nodeId: nodeId,
        status: "success",
      })
    );
    return {
      ...context,
      [openaiData.variable]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(
      openAIChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
