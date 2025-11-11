import type { Connection, Node } from "@/server/db/schema";
import toposort from "toposort";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export const SortNodes = (nodes: Node[], connections: Connection[]): Node[] => {
  if (connections.length === 0) {
    return nodes;
  }
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  const connectedNodeIds = new Set<string>(
    connections.flatMap((conn) => [conn.fromNodeId, conn.toNodeId])
  );
  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    sortedNodeIds = Array.from(new Set(sortedNodeIds));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle. Please fix the connections.");
    }
    throw error;
  }

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};

export async function fetchChannelToken<
  TChannel extends () => ReturnType<any>,
  TTopics extends readonly string[]
>(channel: TChannel, topics: TTopics): Promise<any> {
  return await getSubscriptionToken(inngest, {
    channel: channel(),
    topics: Array.from(topics),
  });
}
