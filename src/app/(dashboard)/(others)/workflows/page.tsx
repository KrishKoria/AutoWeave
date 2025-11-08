import { requireAuth } from "@/lib/auth-utils";
import { api, HydrateClient } from "@/trpc/server";
import WorkflowsList, {
  WorkflowsContainer,
  WorkflowsLoading,
} from "../../_components/workflows";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { workflowsParamsLoader } from "@/lib/params-loader";

type WorkflowsPageProps = {
  searchParams: Promise<SearchParams>;
};
export default async function WorkflowsPage({
  searchParams,
}: WorkflowsPageProps) {
  await requireAuth();
  const params = await workflowsParamsLoader(searchParams);

  await api.workflows.getMany.prefetch(params);

  return (
    <HydrateClient>
      <WorkflowsContainer>
        <Suspense fallback={<WorkflowsLoading />}>
          <WorkflowsList />
        </Suspense>
      </WorkflowsContainer>
    </HydrateClient>
  );
}
