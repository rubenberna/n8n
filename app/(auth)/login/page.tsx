import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnAuth } from "@/lib/auth/auth-utils";

export default async function LoginPage() {
  await requireUnAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <LoginForm />
      </main>
    </div>
  );
}
