import { requireAuth } from "@/lib/auth/auth-utils";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { credentialId } = await params;
  await requireAuth();

  return <div>Credential id: {credentialId}</div>;
}
