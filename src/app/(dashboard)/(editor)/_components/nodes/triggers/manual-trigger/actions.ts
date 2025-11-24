"use server";
import { manualTriggerChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type ManualTriggerToken = Realtime.Token<
  typeof manualTriggerChannel,
  ["status"]
>;

export async function fetchManualTriggerToken(): Promise<ManualTriggerToken> {
  return fetchChannelToken(manualTriggerChannel, ["status"]);
}
