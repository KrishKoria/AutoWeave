import { AnthropicNode } from "@/app/(dashboard)/(editor)/_components/nodes/executions/anthropic/node";
import { DeepSeekNode } from "@/app/(dashboard)/(editor)/_components/nodes/executions/deepseek/node";
import { DiscordNode } from "@/app/(dashboard)/(editor)/_components/nodes/executions/discord/node";
import { GeminiNode } from "@/app/(dashboard)/(editor)/_components/nodes/executions/gemini/node";
import { HttpRequestNode } from "@/app/(dashboard)/(editor)/_components/nodes/executions/http-request/node";
import { OpenAINode } from "@/app/(dashboard)/(editor)/_components/nodes/executions/openai/node";
import { SlackNode } from "@/app/(dashboard)/(editor)/_components/nodes/executions/slack/node";
import { InitialNode } from "@/app/(dashboard)/(editor)/_components/nodes/initialNode";
import { GoogleFormNode } from "@/app/(dashboard)/(editor)/_components/nodes/triggers/google-form/node";
import { ManualTriggerNode } from "@/app/(dashboard)/(editor)/_components/nodes/triggers/manual-trigger/node";
import { StripeNode } from "@/app/(dashboard)/(editor)/_components/nodes/triggers/stripe/node";
import { NodeType } from "@/server/db/schema";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormNode,
  [NodeType.STRIPE_TRIGGER]: StripeNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.DEEPSEEK]: DeepSeekNode,
  [NodeType.OPENAI]: OpenAINode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
