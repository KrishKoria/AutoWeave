import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { workflows } from "@/server/db/schema";
import { SortNodes } from "./utils";

export const executeWorkflow = inngest.createFunction(
  {
    id: "executeWorkflow",
  },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }
    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await db.query.workflows.findFirst({
        where: eq(workflowId, workflows.id),
        with: { nodes: true, connections: true },
      });
      if (!workflow) {
        throw new NonRetriableError("Workflow not found");
      }
      return SortNodes(workflow.nodes, workflow.connections);
    });
    return { sortedNodes };
  }
);
