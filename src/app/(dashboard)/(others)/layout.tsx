import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "../_components/appheader";

export default function OthersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
