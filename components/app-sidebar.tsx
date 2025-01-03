"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Command, Home, Inbox, Settings2, Truck } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavEvents } from "@/components/nav-workspaces";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";
import { NavUser } from "./nav-user";
import { Skeleton } from "./ui/skeleton";

type Event = Database["public"]["Tables"]["Event"]["Row"];

// Navigation data
const navigationData = {
  navMain: [
    {
      title: "Home",
      url: "/[orgId]",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "/[orgId]/inbox",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "/[orgId]/calendar",
      icon: Calendar,
    },
    {
      title: "Suppliers",
      url: "/[orgId]/suppliers",
      icon: Truck,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/[orgId]/settings/profile",
      icon: Settings2,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  orgId: string;
}

export function AppSidebar({ orgId, ...props }: AppSidebarProps) {
  const supabase = createClient();

  // Query for organization details
  const { data: organizations, isLoading: isLoadingOrg } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("OrganizationMember")
        .select(
          `
        organization:Organization(
          id,
          name,
          description
        ),
        User!inner(
          subscriptionStatus
        )
      `
        )
        .eq("userId", user.id);

      if (error) throw error;
      return (
        data?.map((item) => ({
          id: item.organization.id,
          name: item.organization.name,
          logo: Command,
          plan: item.User.subscriptionStatus,
        })) ?? []
      );
    },
  });

  // Query for events in the organization
  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ["events", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Event")
        .select("*")
        .eq("orgId", orgId)
        .eq("is_deleted", false)
        .order("startTime", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!orgId,
  });

  // Transform events directly without workspace wrapper
  const transformedEvents = events
    ? events.map((event) => ({
        id: event.id,
        name: event.title,
        emoji: (event.status === "Draft" ? "📝" : "📅") as React.ReactNode,
        startTime: event.startTime,
      }))
    : [];

  if (isLoadingOrg || isLoadingEvents) {
    return (
      <div className="flex h-screen w-64 flex-col gap-4 p-4">
        {/* Organization skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-4 w-[120px]" />
        </div>

        {/* Navigation items skeleton */}
        <div className="space-y-2 py-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>

        {/* Events section skeleton */}
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
