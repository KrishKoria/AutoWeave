"use client";
import { useCreateWorkflow, useSuspenseWorkflows } from "@/hooks/use-workflows";
import { EntityContainer, EntityHeader } from "./entity-components";
import { useUpgradeModal } from "../_hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

export default function WorkflowsList() {
  const [data, query] = useSuspenseWorkflows();
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
      search={undefined}
      pagination={undefined}
    >
      {children}
    </EntityContainer>
  );
};
