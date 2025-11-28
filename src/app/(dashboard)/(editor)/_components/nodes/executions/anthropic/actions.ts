"use server";
import { anthropicChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type AnthropicToken = Realtime.Token<
  typeof anthropicChannel,
  ["status"]
>;

export async function fetchAnthropicToken(): Promise<AnthropicToken> {
  return fetchChannelToken(anthropicChannel, ["status"]);
}
