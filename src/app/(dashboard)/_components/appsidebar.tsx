"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Home",
    items: [
      {
        name: "Workflows",
        href: "/workflows",
        icon: FolderOpenIcon,
      },
      {
        name: "Credentials",
        href: "/credentials",
        icon: KeyIcon,
      },
      {
        name: "Executions",
        href: "/executions",
        icon: HistoryIcon,
      },
    ],
  },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <Link href="/" className="flex items-center gap-x-2" prefetch>
              <Image
                src={"/icons/logo.svg"}
                alt="Website Logo"
                width={35}
                height={35}
              />
              <span className="font-semibold text-2xl">AutoWeave</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((section) => (
          <SidebarGroup key={section.title} className="mb-6">
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.name} className="mb-1">
                    <SidebarMenuButton
                      tooltip={item.name}
                      isActive={
                        item.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.href)
                      }
                      asChild
                      className="gap-x-4 h-10 px-4"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-x-2"
                        prefetch
                      >
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Upgrade to Pro"}
              className="gap-x-4 h-10 px-4"
              onClick={() => router.push("/upgrade")}
            >
              <StarIcon className="size-4" />
              <span>Upgrade to Pro</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Billing Portal"}
              className="gap-x-4 h-10 px-4"
              onClick={() => router.push("/billing")}
            >
              <CreditCardIcon className="size-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Sign Out"}
              className="gap-x-4 h-10 px-4"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <LogOutIcon className="size-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
