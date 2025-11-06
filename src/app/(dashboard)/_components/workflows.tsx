"use client";
import { useCreateWorkflow, useSuspenseWorkflows } from "@/hooks/use-workflows";
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "./entity-components";
import { useUpgradeModal } from "../_hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../_hooks/use-workflows-params";
import { useSearch } from "../_hooks/use-search";

export default function WorkflowsList() {
  const [data] = useSuspenseWorkflows();
  return (
    <div className="flex-1 flex justify-center items-center">
      <p>{JSON.stringify(data, null, 2)}</p>
    </div>
  );
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const router = useRouter();
  const { handleError, modal } = useUpgradeModal();
  const handleCreateWorkflow = () => {
    createWorkflow.mutate(
      {},
      {
        onSuccess: (data) => {
          router.push(`/workflows/${data?.id}`);
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  };
  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create or Manage your workflows"
        newButtonLabel="New Workflow"
        onNew={handleCreateWorkflow}
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { search, setSearch } = useSearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={search}
      onChange={setSearch}
      placeholder="Search Workflows"
    />
  );
};

export const WorkflowsPagination = () => {
  const [params, setParams] = useWorkflowsParams();
  const [data, query] = useSuspenseWorkflows();
  return (
    <EntityPagination
      page={data.page}
      totalPages={data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
      disabled={query.isFetching}
    />
  );
};
