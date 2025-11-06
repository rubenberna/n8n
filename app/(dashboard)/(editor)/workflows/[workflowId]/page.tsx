import {
  Editor,
  EditorError,
  EditorLoading,
} from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}
export default async function Page({ params }: PageProps) {
  requireAuth();
  const { workflowId } = await params;
  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <main className="flex-1">
            <EditorHeader workflowId={workflowId} />
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
