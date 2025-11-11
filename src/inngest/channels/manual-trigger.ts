import { channel, topic } from "@inngest/realtime";
import z from "zod";

export const manualTriggerChannel = channel("manual-trigger").addTopic(
  topic("status").schema(
    z.object({
      nodeId: z.string(),
      status: z.enum(["loading", "success", "error"]),
    })
  )
);
