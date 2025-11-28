"use server";
import { deepseekChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type DeepSeekToken = Realtime.Token<typeof deepseekChannel, ["status"]>;

export async function fetchDeepSeekToken(): Promise<DeepSeekToken> {
  return fetchChannelToken(deepseekChannel, ["status"]);
}
