import { requireAuth } from "@/lib/auth-utils";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { Editor, EditorLoading } from "../../_components/editor";
import { EditorHeader } from "../../_components/editorHeader";

type WorkflowProps = {
  params: Promise<{
    workflowID: string;
  }>;
};

export default async function WorkflowPage({ params }: WorkflowProps) {
  await requireAuth();
  const { workflowID } = await params;
  await api.workflows.getOne.prefetch({ id: workflowID });
  return (
    <HydrateClient>
      <Suspense fallback={<EditorLoading />}>
        <EditorHeader workflowID={workflowID} />
        <main className="flex-1">
          <Editor workflowID={workflowID} />
        </main>
      </Suspense>
    </HydrateClient>
  );
}
