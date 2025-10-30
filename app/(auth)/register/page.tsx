import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnAuth } from "@/lib/auth/auth-utils";

export default async function RegisterPage() {
  await requireUnAuth();
  return <RegisterForm />;
}
