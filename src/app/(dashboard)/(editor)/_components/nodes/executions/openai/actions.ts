"use server";
import { openAIChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type OpenAIToken = Realtime.Token<typeof openAIChannel, ["status"]>;

export async function fetchOpenAIToken(): Promise<OpenAIToken> {
  return fetchChannelToken(openAIChannel, ["status"]);
}
