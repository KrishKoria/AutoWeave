"use client";
import { useQueryStates } from "nuqs";
import { workflowsParams } from "../(others)/workflows/params";

export const useWorkflowsParams = () => {
  return useQueryStates(workflowsParams);
};
