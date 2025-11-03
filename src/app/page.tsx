import { requireAuth } from "@/lib/auth-utils";
import LogoutButton from "./(auth)/_components/LogoutButton";

export default async function Home() {
  const session = await requireAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Welcome back, {session.user.name}!</h1>
      <LogoutButton />
    </main>
  );
}
