"use client";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "@/hooks/use-workflows";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  LoadingView,
} from "./entity-components";
import { useUpgradeModal } from "../_hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../_hooks/use-workflows-params";
import { useSearch } from "../_hooks/use-search";
import type { Workflow } from "@/server/db/schema";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
export default function WorkflowsList() {
  const [data] = useSuspenseWorkflows();
  if (data.items.length === 0) {
    return <WorkflowsEmpty />;
  }
  return (
    <EntityList
      items={data.items}
      getKey={(item) => item.id}
      renderItem={(item) => <WorkflowItem data={item} />}
      emptyView={<WorkflowsEmpty />}
    />
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

export const WorkflowsLoading = () => {
  return <LoadingView message="Loading workflows" />;
};

export const WorkflowsEmpty = () => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
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
      <EmptyView
        message="No workflow available. You can create a new workflow to continue."
        onNew={handleCreateWorkflow}
      />
    </>
  );
};

export const WorkflowItem = ({ data }: { data: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();
  const handleRemove = () => {
    removeWorkflow.mutate({ id: data.id });
  };
  return (
    <EntityItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subTitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
