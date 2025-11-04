interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}
export default async function Page({ params }: PageProps) {
  const { workflowId } = await params;
  return <div>Workflow id: {workflowId}</div>;
}
