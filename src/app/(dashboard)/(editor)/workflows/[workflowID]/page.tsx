import { requireAuth } from "@/lib/auth-utils";

type WorkflowProps = {
  params: Promise<{
    workflowID: string;
  }>;
};

export default async function WorkflowPage({ params }: WorkflowProps) {
  await requireAuth();
  const { workflowID } = await params;
  return <div>Workflow: {workflowID}</div>;
}
