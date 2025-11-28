import Handlebars from "handlebars";
import type { NodeExecutor } from "@/inngest/types";
import { NonRetriableError } from "inngest";
import { geminiChannel } from "@/inngest/channels";
import type { AVAILABLE_MODELS } from "./dialog";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@/env";
import { generateText } from "ai";

type GeminiData = {
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

export const GeminiExecutor: NodeExecutor = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const geminiData = data as GeminiData;

  await publish(
    geminiChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );
  if (!geminiData.variable) {
    await publish(
      geminiChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Variable name is not defined.");
  }

  if (!geminiData.userPrompt) {
    await publish(
      geminiChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("User prompt is missing.");
  }
  const systemPromptData = geminiData.systemPrompt
    ? Handlebars.compile(geminiData.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPromptData = Handlebars.compile(geminiData.userPrompt)(context);
  const credentails = env.GOOGLE_GENRATIVE_AI_API_KEY;
  const google = createGoogleGenerativeAI({
    apiKey: credentails,
  });
  try {
    const { steps } = await step.ai.wrap("generate-text-gemini", generateText, {
      model: google(geminiData.model || "gemini-2.5-flash"),
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
      geminiChannel().status({
        nodeId: nodeId,
        status: "success",
      })
    );
    return {
      ...context,
      [geminiData.variable]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(
      geminiChannel().status({
        nodeId: nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
