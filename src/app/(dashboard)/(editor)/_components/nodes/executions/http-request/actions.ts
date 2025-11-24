"use server";
import { httpRequestChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type HTTPRequestToken = Realtime.Token<
  typeof httpRequestChannel,
  ["status"]
>;

export async function fetchHTTPRequestToken(): Promise<HTTPRequestToken> {
  return fetchChannelToken(httpRequestChannel, ["status"]);
}
