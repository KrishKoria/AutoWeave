import { requireAuth } from "@/lib/auth-utils";
import { api } from "@/trpc/server";
import WorkflowsList, { WorkflowsContainer } from "../../_components/workflows";
import { Suspense } from "react";

export default async function WorkflowsPage() {
  await requireAuth();
  void api.workflows.getMany.prefetch();
  return (
    <WorkflowsContainer>
      <Suspense fallback={<div>Loading workflows...</div>}>
        <WorkflowsList />
      </Suspense>
    </WorkflowsContainer>
  );
}
