import { NodeType } from "@/server/db/schema";
import type { NodeExecutor } from "./types";
import { ManualTriggerExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/triggers/manual-trigger/executor";
import { HttpRequestExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/executions/http-request/executor";
import { GoogleFormExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/triggers/google-form/executor";
import { StripeExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/triggers/stripe/executor";
import { GeminiExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/executions/gemini/executor";
import { AnthropicExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/executions/anthropic/executor";
import { DeepSeekExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/executions/deepseek/executor";
import { OpenAIExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/executions/openai/executor";
import { DiscordExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/executions/discord/executor";
import { SlackExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/executions/slack/executor";

export const executorRegistry: Record<keyof typeof NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: ManualTriggerExecutor,
  [NodeType.INITIAL]: ManualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: HttpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormExecutor,
  [NodeType.STRIPE_TRIGGER]: StripeExecutor,
  [NodeType.GEMINI]: GeminiExecutor,
  [NodeType.ANTHROPIC]: AnthropicExecutor,
  [NodeType.DEEPSEEK]: DeepSeekExecutor,
  [NodeType.OPENAI]: OpenAIExecutor,
  [NodeType.DISCORD]: DiscordExecutor,
  [NodeType.SLACK]: SlackExecutor,
};

export const getNodeExecutor = (type: keyof typeof NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }
  return executor;
};
