"use client";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import {
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from "../../_hooks/use-workflows";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAtomValue } from "jotai";
import { editorAtom } from "@/store/atoms";

export const EditorSaveButton = ({ workflowID }: { workflowID: string }) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow();
  const handleSave = () => {
    if (!editor) return;
    const nodes = editor.getNodes();
    const edges = editor.getEdges();
    saveWorkflow.mutate({ id: workflowID, nodes, edges });
  };
  return (
    <div className="ml-auto">
      <Button
        size={"sm"}
        onClick={handleSave}
        disabled={saveWorkflow.isPending}
      >
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
};

export const EditorNameInput = ({ workflowID }: { workflowID: string }) => {
  const [data] = useSuspenseWorkflow(workflowID);
  const updateWorkflow = useUpdateWorkflowName();
  const [editing, isEditing] = useState(false);
  const [name, setName] = useState(data.name);
  const inputref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data.name) {
      setName(data.name);
    }
  }, [data.name]);

  useEffect(() => {
    if (editing && inputref.current) {
      inputref.current.focus();
      inputref.current.select();
    }
  }, [editing]);

  const handleSave = async () => {
    if (name === data.name) {
      isEditing(false);
      return;
    }

    try {
      await updateWorkflow.mutateAsync({ id: workflowID, name });
    } catch (error) {
      setName(data.name);
    } finally {
      isEditing(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(data.name);
      isEditing(false);
    }
  };
  if (editing) {
    return (
      <Input
        disabled={updateWorkflow.isPending}
        ref={inputref}
        className="h-7 w-auto min-w-[100px] px-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
      />
    );
  }
  return (
    <BreadcrumbItem
      onClick={() => isEditing(true)}
      className="cursor-pointer hover:text-foreground transition-colors"
    >
      {data.name}
    </BreadcrumbItem>
  );
};

export const EditorBreadcrumbs = ({ workflowID }: { workflowID: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/workflows" prefetch>
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowID={workflowID} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export function EditorHeader({ workflowID }: { workflowID: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background justify-between">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs workflowID={workflowID} />
        <EditorSaveButton workflowID={workflowID} />
      </div>
      <ModeToggle />
    </header>
  );
}
