import { requireAuth } from "@/lib/auth-utils";

interface CredentialProps {
  params: Promise<{
    credentialID: string;
  }>;
}
export default async function CredentialPage({ params }: CredentialProps) {
  await requireAuth();
  const { credentialID } = await params;
  return <div>Credential: {credentialID}</div>;
}
