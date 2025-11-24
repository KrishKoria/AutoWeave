import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormDialog } from "./dialog";
import { useNodeStatus } from "@/app/(dashboard)/_hooks/use-node-status";
import { googleFormChannel } from "@/inngest/channels";
import { fetchGoogleFormToken } from "./actions";

export const GoogleFormNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenSettings = () => setOpen(true);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: googleFormChannel().name,
    topic: "status",
    refreshToken: fetchGoogleFormToken,
  });
  return (
    <>
      <GoogleFormDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={"/icons/googleform.svg"}
        name="Google Form"
        description={"When form is submitted"}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
