"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import { HttpRequestDialog, type HttpRequestFormValues } from "./dialog";

type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

const nodeStatus = "loading";

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data;
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"} ${nodeData.endpoint}`
    : "Not Configured";

  const handleDialogOpen = () => setOpen(true);
  const handleSubmit = (values: HttpRequestFormValues) => {
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
      <HttpRequestDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name={"HTTP Request"}
        status={nodeStatus}
        description={description}
        onSettings={handleDialogOpen}
        onDoubleClick={handleDialogOpen}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
