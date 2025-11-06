"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  useSuspenseWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";

export function EditorSaveButton({ workflowId }: { workflowId: string }) {
  return (
    <div className="ml-auto">
      <Button size="sm" onClick={() => {}} disabled={false}>
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
}

export function EditorBreadcrumbs({ workflowId }: { workflowId: string }) {
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
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function EditorNameInput({ workflowId }: { workflowId: string }) {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updatedName = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name?.trim() === workflow.name) {
      setIsEditing(false);
      return;
    }
    setIsEditing(false);

    try {
      await updatedName.mutateAsync({ id: workflowId, name });
    } catch (error) {
      setName(workflow.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        type="text"
        className="h-7 w-auto min-w-[100px] px-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        disabled={updatedName.isPending}
      />
    );
  }

  return (
    <BreadcrumbItem
      className="cursor-pointer hover:text-foreground transition-colors"
      onClick={() => setIsEditing(true)}
    >
      {workflow.name}
    </BreadcrumbItem>
  );
}

export function EditorHeader({ workflowId }: { workflowId: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-gray-100 px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between w-full gap-x-4">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
}
