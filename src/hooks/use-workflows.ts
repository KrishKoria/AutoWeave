"use client";

import { useWorkflowsParams } from "@/app/(dashboard)/_hooks/use-workflows-params";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useSuspenseWorkflows = () => {
  const [params] = useWorkflowsParams();
  return api.workflows.getMany.useSuspenseQuery(params);
};

export const useCreateWorkflow = () => {
  const utils = api.useUtils();
  return api.workflows.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Workflow ${data?.name} created successfully`);
      void utils.workflows.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to create Workflow: ${error.message}`);
    },
  });
};

export const useRemoveWorkflow = () => {
  const utils = api.useUtils();
  return api.workflows.remove.useMutation({
    onSuccess: (data) => {
      toast.success(`Workflow ${data?.name} removed successfully`);
      void utils.workflows.getMany.invalidate();
      void utils.workflows.getOne.invalidate({ id: data!.id });
    },
    onError: (error) => {
      toast.error(`Failed to remove Workflow: ${error.message}`);
    },
  });
};
