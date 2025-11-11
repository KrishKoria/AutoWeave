import { NodeType } from "@/server/db/schema";
import type { NodeExecutor } from "./types";
import { ManualTriggerExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/triggers/manual-trigger.tsx/executor";
import { HttpRequestExecutor } from "@/app/(dashboard)/(editor)/_components/nodes/executions/http-request/executor";
export const executorRegistry: Record<keyof typeof NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: ManualTriggerExecutor,
  [NodeType.INITIAL]: ManualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: HttpRequestExecutor,
};

export const getNodeExecutor = (type: keyof typeof NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }
  return executor;
};
