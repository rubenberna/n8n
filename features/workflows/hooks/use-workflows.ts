/**
 * Hook to fetch all workflows using suspense, meaning it needs to be wrapped in a hydration boundary and SUspense
 *
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

export function useSuspenseWorkflows() {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

export function useCreateWorkflow() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} created successfully`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    })
  );
}

export function useRemoveWorkflow() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} removed successfully`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
    })
  );
}
