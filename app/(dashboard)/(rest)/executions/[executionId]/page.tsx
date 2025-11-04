import { requireAuth } from "@/lib/auth/auth-utils";

interface PageProps {
  params: Promise<{
    executionId: string;
  }>;
}
export default async function Page({ params }: PageProps) {
  const { executionId } = await params;
  await requireAuth();

  return <div>Execution id: {executionId}</div>;
}
