// components/app-sidebar.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Command, Home, Inbox, Settings2 } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavWorkspaces } from "@/components/nav-workspaces";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";
import { Skeleton } from "./ui/skeleton";

type Event = Database["public"]["Tables"]["Event"]["Row"];
type WorkspaceType = {
  name: string;
  emoji: React.ReactNode;
  pages: {
    name: string;
    emoji: React.ReactNode;
  }[];
};
type Organization = Database["public"]["Tables"]["Organization"]["Row"];

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
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/[orgId]/settings",
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
  const { data: organization, isLoading: isLoadingOrg } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Organization")
        .select("*")
        .eq("id", orgId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
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

  // Transform events for workspaces
  const workspaces: WorkspaceType[] = [
    {
      name: "All Events",
      emoji: "📅" as React.ReactNode,
      pages: events
        ? events.map((event) => ({
            name: event.title,
            emoji: (event.status === "Draft" ? "📝" : "📅") as React.ReactNode,
          }))
        : [],
    },
    {
      name: "Upcoming Events",
      emoji: "🎯" as React.ReactNode,
      pages: events
        ? events
            .filter((event) => new Date(event.startTime) > new Date())
            .map((event) => ({
              name: event.title,
              emoji: "📅" as React.ReactNode,
            }))
        : [],
    },
  ];

  // Transform organization for team switcher
  const teams = organization
    ? [
        {
          id: organization.id,
          name: organization.name,
          logo: Command,
          plan: "Enterprise",
        },
      ]
    : [];

  // Mock favorites for now
  // const favorites = [
  //   {
  //     name: "Annual Conference 2024",
  //     url: "/[orgId]/events/1",
  //     emoji: "🎯",
  //   },
  //   {
  //     name: "Team Building Workshop",
  //     url: "/events/2",
  //     emoji: "🤝",
  //   },
  // ];

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
        <TeamSwitcher teams={teams} />
        <NavMain items={navigationData.navMain} orgId={orgId} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavFavorites favorites={favorites} /> */}
        <NavWorkspaces workspaces={workspaces} />
        <NavSecondary
          items={navigationData.navSecondary}
          className="mt-auto"
          orgId={orgId}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
