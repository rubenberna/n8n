"use client";

import { formatDistanceToNow } from "date-fns";
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  LoadingView,
  ErrorView,
  EmptyView,
  EntityList,
  EntityItem,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { EntitySearch } from "@/components/entity-components";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { WorkflowModel } from "@/lib/generated/prisma/models/Workflow";
import { WorkflowIcon } from "lucide-react";

export function WorkflowsSearch() {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, setSearchValue } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={setSearchValue}
      placeholder="Search workflows"
    />
  );
}

export function WorkflowsList() {
  const workflows = useSuspenseWorkflows();

  return (
    <EntityList
      items={workflows.data.items}
      renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
      getKey={(workflow) => workflow.id}
      emptyView={<WorkflowsEmpty />}
    />
  );
}

export function WorkflowsHeader({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { modal, handleError } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        if (handleError(error)) {
          return;
        }
      },
    });
  };

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
}

export function WorkflowsPagination() {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      page={workflows.data.page}
      totalPages={workflows.data.totalPages}
      disabled={workflows.isFetching}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
}

export function WorkflowsLoading() {
  return <LoadingView message="Loading workflows..." />;
}

export function WorkflowsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EntityContainer
      header={<WorkflowsHeader disabled={false} />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
}

export function WorkflowsError() {
  return <ErrorView message="Error loading workflows" />;
}

export function WorkflowsEmpty() {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { modal, handleError } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        if (handleError(error)) {
          return;
        }
      },
    });
  };
  return (
    <>
      {modal}
      <EmptyView
        message="You haven't created any workflows yet. Get started by creating your first workflow."
        onNew={handleCreate}
      />
    </>
  );
}

export function WorkflowItem({ workflow }: { workflow: WorkflowModel }) {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = (id: string) => {
    removeWorkflow.mutate({ id });
  };
  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={() => handleRemove(workflow.id)}
      isRemoving={removeWorkflow.isPending}
    />
  );
}
