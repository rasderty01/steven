"use client";

import { Calendar, Command, Home, Inbox, Settings2, Truck } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavEvents } from "@/components/sidebar/nav-workspaces";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { NavUser } from "./nav-user";
import {
  useOrganizations,
  useOrganizationEvents,
  transformEventsForSidebar,
} from "./queries";

// Navigation data (moved outside component to prevent recreating on each render)
const navigationData = {
  navMain: [
    { title: "Home", url: "/[orgId]", icon: Home },
    { title: "Inbox", url: "/[orgId]/inbox", icon: Inbox },
    { title: "Calendar", url: "/[orgId]/calendar", icon: Calendar },
    { title: "Suppliers", url: "/[orgId]/suppliers", icon: Truck },
  ],
  navSecondary: [
    { title: "Settings", url: "/[orgId]/settings/profile", icon: Settings2 },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  orgId: string;
}

export function AppSidebar({ orgId, ...props }: AppSidebarProps) {
  // Use centralized queries
  const { data: organizations, isLoading: isLoadingOrg } = useOrganizations();
  const { data: events, isLoading: isLoadingEvents } =
    useOrganizationEvents(orgId);

  // Transform events for sidebar display
  const transformedEvents = events ? transformEventsForSidebar(events) : [];

  if (isLoadingOrg || isLoadingEvents) {
    return (
      <div className="flex h-screen w-64 flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
        <div className="space-y-2 py-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={organizations ?? []} currentOrgId={orgId} />
        <NavMain items={navigationData.navMain} orgId={orgId} />
      </SidebarHeader>
      <SidebarContent>
        <NavEvents
          events={transformedEvents}
          onPageClick={(pageName) => {
            console.log("Page clicked:", pageName);
          }}
        />
        <NavSecondary
          items={navigationData.navSecondary}
          className="mt-auto"
          orgId={orgId}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser orgId={orgId} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
