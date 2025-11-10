"use client";

import WorkflowNode from "@/app/(dashboard)/(editor)/_components/nodes/workflow-node";
import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import {
  BaseNode,
  BaseNodeContent,
} from "../../../../../../components/base-node";
import Image from "next/image";
import { BaseHandle } from "../../../../../../components/base-handle";
import {
  NodeStatusIndicator,
  type NodeStatus,
} from "@/components/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
  children?: React.ReactNode;
  icon: LucideIcon | string;
  name: string;
  description?: string;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    children,
    icon: Icon,
    name,
    description,
    onSettings,
    status = "initial",
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const handleDelete = () => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
    };
    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <NodeStatusIndicator
          status={status}
          variant="border"
          className="rounded-l-2xl"
        >
          <BaseNode
            onDoubleClick={onDoubleClick}
            className="rounded-l-2xl relative group"
            status={status}
          >
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} alt={name} width={16} height={16} />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}
              {children}
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  }
);

BaseTriggerNode.displayName = "BaseTriggerNode";
