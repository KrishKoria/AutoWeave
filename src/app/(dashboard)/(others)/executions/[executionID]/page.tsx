import { requireAuth } from "@/lib/auth-utils";

interface ExecutionProps {
  params: Promise<{
    executionID: string;
  }>;
}
export default async function ExecutionPage({ params }: ExecutionProps) {
  await requireAuth();
  const { executionID } = await params;
  return <div>Execution: {executionID}</div>;
}
