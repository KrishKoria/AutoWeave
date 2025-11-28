"use server";
import { geminiChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type GeminiToken = Realtime.Token<typeof geminiChannel, ["status"]>;

export async function fetchGeminiToken(): Promise<GeminiToken> {
  return fetchChannelToken(geminiChannel, ["status"]);
}
