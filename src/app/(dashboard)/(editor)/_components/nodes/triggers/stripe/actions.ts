"use server";
import { stripeChannel } from "@/inngest/channels";
import { fetchChannelToken } from "@/inngest/utils";
import { Realtime } from "@inngest/realtime";

export type StripeToken = Realtime.Token<typeof stripeChannel, ["status"]>;

export async function fetchStripeToken(): Promise<StripeToken> {
  return fetchChannelToken(stripeChannel, ["status"]);
}
