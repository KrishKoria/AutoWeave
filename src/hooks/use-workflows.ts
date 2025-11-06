"use client";

import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useSuspenseWorkflows = () => {
  return api.workflows.getMany.useSuspenseQuery();
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
