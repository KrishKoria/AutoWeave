import { HttpRequestNode } from "@/app/(dashboard)/(editor)/_components/nodes/executions/http-request/node";
import { InitialNode } from "@/app/(dashboard)/(editor)/_components/nodes/initialNode";
import { GoogleFormNode } from "@/app/(dashboard)/(editor)/_components/nodes/triggers/google-form/node";
import { ManualTriggerNode } from "@/app/(dashboard)/(editor)/_components/nodes/triggers/manual-trigger/node";
import { NodeType } from "@/server/db/schema";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
