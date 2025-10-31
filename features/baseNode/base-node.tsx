"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function BaseNode() {
  const trpc = useTRPC();
  const testAi = useMutation(
    trpc.testAi.mutationOptions({
      onSuccess: (data) => {
        console.log(data);
        toast.success(data.message);
      },
    })
  );
  const { data: workflows } = useSuspenseQuery(
    trpc.getWorkflows.queryOptions()
  );

  const createWorkflow = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Job queued");
      },
      onError: (error) => {
        console.error(error);
      },
    })
  );
  console.log(workflows);
  return (
    <div>
      <Button
        onClick={() => createWorkflow.mutate()}
        disabled={createWorkflow.isPending}
      >
        Create Workflow
      </Button>
      <Button onClick={() => testAi.mutate()} disabled={testAi.isPending}>
        Test AI
      </Button>
    </div>
  );
}
