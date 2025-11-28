"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {
  AVAILABLE_MODELS,
  GeminiDialog,
  type GeminiFormValues,
} from "./dialog";
import { useNodeStatus } from "@/app/(dashboard)/_hooks/use-node-status";
import { geminiChannel } from "@/inngest/channels";
import { fetchGeminiToken } from "./actions";

type GeminiNodeData = {
  variable?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const nodeData = props.data;
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: geminiChannel().name,
    topic: "status",
    refreshToken: fetchGeminiToken,
  });
  const description = nodeData?.model
    ? `${nodeData.model || AVAILABLE_MODELS[0]} : ${nodeData.userPrompt?.slice(
        0,
        50
      )}...`
    : "Not Configured";

  const handleDialogOpen = () => setOpen(true);

  const handleSubmit = (values: GeminiFormValues) => {
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
      <GeminiDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/icons/gemini.svg"}
        name={"Gemini"}
        status={nodeStatus}
        description={description}
        onSettings={handleDialogOpen}
        onDoubleClick={handleDialogOpen}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
