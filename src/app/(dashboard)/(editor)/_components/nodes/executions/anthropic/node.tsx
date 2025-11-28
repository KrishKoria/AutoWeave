"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {
  AVAILABLE_MODELS,
  AnthropicDialog,
  type AnthropicFormValues,
} from "./dialog";
import { useNodeStatus } from "@/app/(dashboard)/_hooks/use-node-status";
import { anthropicChannel } from "@/inngest/channels";
import { fetchAnthropicToken } from "./actions";

type AnthropicNodeData = {
  variable?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const nodeData = props.data;
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: anthropicChannel().name,
    topic: "status",
    refreshToken: fetchAnthropicToken,
  });
  const description = nodeData?.model
    ? `${nodeData.model || AVAILABLE_MODELS[0]} : ${nodeData.userPrompt?.slice(
        0,
        50
      )}...`
    : "Not Configured";

  const handleDialogOpen = () => setOpen(true);

  const handleSubmit = (values: AnthropicFormValues) => {
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
      <AnthropicDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/icons/anthropic.svg"}
        name={"Anthropic"}
        status={nodeStatus}
        description={description}
        onSettings={handleDialogOpen}
        onDoubleClick={handleDialogOpen}
      />
    </>
  );
});

AnthropicNode.displayName = "AnthropicNode";
