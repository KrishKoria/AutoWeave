import { stripeChannel } from "@/inngest/channels";
import type { NodeExecutor } from "@/inngest/types";

type StripeData = Record<string, unknown>;
export const StripeExecutor: NodeExecutor<StripeData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    stripeChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );
  const result = await step.run("Stripe trigger", async () => context);
  await publish(
    stripeChannel().status({
      nodeId: nodeId,
      status: "success",
    })
  );
  return result;
};
