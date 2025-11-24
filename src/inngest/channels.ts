import { channel, topic } from "@inngest/realtime";
import z from "zod";

export const httpRequestChannel = channel("http-request").addTopic(
  topic("status").schema(
    z.object({
      nodeId: z.string(),
      status: z.enum(["loading", "success", "error"]),
    })
  )
);

export const manualTriggerChannel = channel("manual-trigger").addTopic(
  topic("status").schema(
    z.object({
      nodeId: z.string(),
      status: z.enum(["loading", "success", "error"]),
    })
  )
);

export const googleFormChannel = channel("google-form").addTopic(
  topic("status").schema(
    z.object({
      nodeId: z.string(),
      status: z.enum(["loading", "success", "error"]),
    })
  )
);
