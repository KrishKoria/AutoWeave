"use client";

import { LoadingView } from "../../_components/entity-components";
import { useSuspenseWorkflow } from "../../_hooks/use-workflows";

export const EditorLoading = () => {
  return <LoadingView message="Loading Editor" />;
};

export function Editor({ workflowID }: { workflowID: string }) {
  const [data] = useSuspenseWorkflow(workflowID);
  return <p>{JSON.stringify(data, null, 2)}</p>;
}
