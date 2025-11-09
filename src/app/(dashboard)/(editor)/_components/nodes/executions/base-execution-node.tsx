"use client";

import WorkflowNode from "@/app/(dashboard)/(editor)/_components/nodes/workflow-node";
import { Position, type NodeProps } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import {
  BaseNode,
  BaseNodeContent,
} from "../../../../../../components/base-node";
import Image from "next/image";
import { BaseHandle } from "../../../../../../components/base-handle";

interface BaseExecutionNodeProps extends NodeProps {
  children?: React.ReactNode;
  icon: LucideIcon | string;
  name: string;
  description?: string;
  //   status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    children,
    icon: Icon,
    name,
    description,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    const handleDelete = () => {};
    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <BaseNode onDoubleClick={onDoubleClick}>
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle id="target-1" type="target" position={Position.Left} />
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    );
  }
);

BaseExecutionNode.displayName = "BaseExecutionNode";
