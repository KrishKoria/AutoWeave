import { googleFormChannel } from "@/inngest/channels";
import type { NodeExecutor } from "@/inngest/types";

type GoogleFormData = Record<string, unknown>;
export const GoogleFormExecutor: NodeExecutor<GoogleFormData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    googleFormChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );
  const result = await step.run("Google form trigger", async () => context);
  await publish(
    googleFormChannel().status({
      nodeId: nodeId,
      status: "success",
    })
  );
  return result;
};
