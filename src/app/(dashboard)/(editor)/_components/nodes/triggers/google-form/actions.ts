"use server";
import { googleFormChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type GoogleFormToken = Realtime.Token<
  typeof googleFormChannel,
  ["status"]
>;

export async function fetchGoogleFormToken(): Promise<GoogleFormToken> {
  return fetchChannelToken(googleFormChannel, ["status"]);
}
