import { manualTriggerChannel } from "@/inngest/channels";
import type { NodeExecutor } from "@/inngest/types";

type ManualTriggerData = Record<string, unknown>;
export const ManualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    manualTriggerChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );
  const result = await step.run("Manual trigger", async () => context);
  await publish(
    manualTriggerChannel().status({
      nodeId: nodeId,
      status: "success",
    })
  );
  return result;
};
