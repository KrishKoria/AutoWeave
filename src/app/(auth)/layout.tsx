import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-muted flex min-h-svh items-center flex-col justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-bold text-2xl"
        >
          <Image
            src="/icons/logo.svg"
            alt="AutoWeave Logo"
            width={40}
            height={40}
          />
          AutoWeave
        </Link>
        {children}
      </div>
    </div>
  );
}
