import { Button } from "@/components/ui/button";
import { FlaskConicalIcon } from "lucide-react";
import { useExecuteWorkflow } from "../../_hooks/use-workflows";

export default function ExecuteWorkflow({
  workflowID,
}: {
  workflowID: string;
}) {
  const executeWorkflow = useExecuteWorkflow();
  const handleExecuteWorkflow = () => {
    executeWorkflow.mutate({ id: workflowID });
  };
  return (
    <Button
      size={"lg"}
      onClick={handleExecuteWorkflow}
      disabled={executeWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
}
