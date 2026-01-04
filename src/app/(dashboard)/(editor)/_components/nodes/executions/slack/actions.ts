"use server";
import { slackChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type SlackToken = Realtime.Token<typeof slackChannel, ["status"]>;

export async function fetchSlackToken(): Promise<SlackToken> {
  return fetchChannelToken(slackChannel, ["status"]);
}
