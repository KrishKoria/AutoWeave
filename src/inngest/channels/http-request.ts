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
