import { channel, topic } from "@inngest/realtime";
import z from "zod";

const nodeStatusSchema = z.object({
  nodeId: z.string(),
  status: z.enum(["loading", "success", "error"]),
});

function createNodeStatusChannel(name: string) {
  return channel(name).addTopic(topic("status").schema(nodeStatusSchema));
}

export const httpRequestChannel = createNodeStatusChannel("http-request");
export const manualTriggerChannel = createNodeStatusChannel("manual-trigger");
export const googleFormChannel = createNodeStatusChannel("google-form");
export const stripeChannel = createNodeStatusChannel("stripe");
export const anthropicChannel = createNodeStatusChannel("anthropic");
export const geminiChannel = createNodeStatusChannel("gemini");
export const deepseekChannel = createNodeStatusChannel("deepseek");
export const openAIChannel = createNodeStatusChannel("openai");
