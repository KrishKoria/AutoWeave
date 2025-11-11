import type { NodeExecutor } from "@/inngest/types";

type ManualTriggerData = Record<string, unknown>;
export const ManualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const result = await step.run("Manual trigger", async () => context);
  return result;
};
