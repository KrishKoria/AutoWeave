"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { SlackDialog, type SlackFormValues } from "./dialog";
import { useNodeStatus } from "@/app/(dashboard)/_hooks/use-node-status";
import { fetchSlackToken } from "./actions";
import { slackChannel } from "@/inngest/channels";

type SlackNodeData = {
  variable?: string;
  webhookUrl?: string;
  message?: string;
  channel?: string;
  username?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const nodeData = props.data;
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: slackChannel().name,
    topic: "status",
    refreshToken: fetchSlackToken,
  });

  const description = nodeData?.message
    ? `${nodeData.message.slice(0, 50)}${nodeData.message.length > 50 ? "..." : ""}`
    : "Not Configured";

  const handleDialogOpen = () => setOpen(true);

  const handleSubmit = (values: SlackFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <>
      <SlackDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/icons/slack.svg"}
        name={"Slack"}
        status={nodeStatus}
        description={description}
        onSettings={handleDialogOpen}
        onDoubleClick={handleDialogOpen}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";
