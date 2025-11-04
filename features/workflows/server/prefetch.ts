import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

/**
 * Prefetch the workflows list
 * @returns The prefetched workflows list
 */

export function prefetchWorkflows(input: Input) {
  return prefetch(trpc.workflows.getMany.queryOptions(input));
}
