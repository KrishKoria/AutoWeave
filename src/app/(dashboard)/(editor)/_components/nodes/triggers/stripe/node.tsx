import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { useNodeStatus } from "@/app/(dashboard)/_hooks/use-node-status";
import { stripeChannel } from "@/inngest/channels";
import { StripeDialog } from "./dialog";
import { fetchStripeToken } from "./actions";

export const StripeNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenSettings = () => setOpen(true);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: stripeChannel().name,
    topic: "status",
    refreshToken: fetchStripeToken,
  });
  return (
    <>
      <StripeDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={"/icons/stripe.svg"}
        name="Stripe"
        description={"When a Stripe event occurs"}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
