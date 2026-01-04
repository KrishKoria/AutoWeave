"use server";
import { discordChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type DiscordToken = Realtime.Token<
  typeof discordChannel,
  ["status"]
>;

export async function fetchDiscordToken(): Promise<DiscordToken> {
  return fetchChannelToken(discordChannel, ["status"]);
}
