"use client";

import {
  IconDashboard,
  IconHeartHandshake,
  IconHelp,
  IconPlus,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import type * as React from "react";
import { NavDealforge } from "@/components/nav-dealforge";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Trader",
    email: "trader@dealforge.com",
    avatar: "/avatars/trader.jpg",
  },
  navMain: [
    {
      title: "Browse Offers",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Create Offer",
      url: "/dashboard/create-offer",
      icon: IconPlus,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
  navAccount: [
    {
      title: "Account",
      url: "/account",
      icon: IconUser,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <div className="rounded-lg bg-primary p-1">
                  <IconHeartHandshake className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-base">DealForge</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavDealforge items={data.navMain} />
        <NavSecondary items={data.navAccount} />
        <NavSecondary className="mt-auto" items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
