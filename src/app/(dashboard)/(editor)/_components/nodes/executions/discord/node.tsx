"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { DiscordDialog, type DiscordFormValues } from "./dialog";
import { useNodeStatus } from "@/app/(dashboard)/_hooks/use-node-status";
import { fetchDiscordToken } from "./actions";
import { discordChannel } from "@/inngest/channels";

type DiscordNodeData = {
  variable?: string;
  webhookUrl?: string;
  message?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const nodeData = props.data;
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: discordChannel().name,
    topic: "status",
    refreshToken: fetchDiscordToken,
  });

  const description = nodeData?.message
    ? `${nodeData.message.slice(0, 50)}${nodeData.message.length > 50 ? "..." : ""}`
    : "Not Configured";

  const handleDialogOpen = () => setOpen(true);

  const handleSubmit = (values: DiscordFormValues) => {
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
      <DiscordDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/icons/discord.svg"}
        name={"Discord"}
        status={nodeStatus}
        description={description}
        onSettings={handleDialogOpen}
        onDoubleClick={handleDialogOpen}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
