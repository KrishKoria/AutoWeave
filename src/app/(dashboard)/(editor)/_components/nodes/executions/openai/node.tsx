"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {
  AVAILABLE_MODELS,
  OpenAIDialog,
  type OpenAIFormValues,
} from "./dialog";
import { useNodeStatus } from "@/app/(dashboard)/_hooks/use-node-status";
import { openAIChannel } from "@/inngest/channels";
import { fetchOpenAIToken } from "./actions";

type OpenAINodeData = {
  variable?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const nodeData = props.data;
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: openAIChannel().name,
    topic: "status",
    refreshToken: fetchOpenAIToken,
  });
  const description = nodeData?.model
    ? `${nodeData.model || AVAILABLE_MODELS[0]} : ${nodeData.userPrompt?.slice(
        0,
        50
      )}...`
    : "Not Configured";

  const handleDialogOpen = () => setOpen(true);

  const handleSubmit = (values: OpenAIFormValues) => {
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
      <OpenAIDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/icons/openai.svg"}
        name={"OpenAI"}
        status={nodeStatus}
        description={description}
        onSettings={handleDialogOpen}
        onDoubleClick={handleDialogOpen}
      />
    </>
  );
});

OpenAINode.displayName = "OpenAINode";
