"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type WorkspaceType = {
  name: string;
  emoji: React.ReactNode;
  pages: {
    id: number;
    name: string;
    emoji: React.ReactNode;
  }[];
};

interface NavEventsProps {
  workspaces: WorkspaceType[];
  onPageClick?: (pageName: string) => void;
}

export function NavWorkspaces({ workspaces, onPageClick }: NavEventsProps) {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const { orgId } = useParams();

  // Calculate total number of events across all workspaces
  const totalEvents = workspaces.reduce(
    (total, workspace) => total + workspace.pages.length,
    0
  );

  // Function to limit pages in each workspace
  const getLimitedPages = (pages: WorkspaceType["pages"]) => {
    if (showAllEvents) {
      return pages;
    }
    return pages.slice(0, 5);
  };

  const handleMoreClick = () => {
    setShowAllEvents(!showAllEvents);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Events</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.map((workspace) => (
            <Collapsible key={workspace.name}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div>
                    <span>{workspace.emoji}</span>
                    <span>{workspace.name}</span>
                  </div>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction
                    className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                    showOnHover
                  >
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <SidebarMenuAction showOnHover>
                  <Plus />
                </SidebarMenuAction>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {getLimitedPages(workspace.pages).map((page) => (
                      <SidebarMenuSubItem key={page.name}>
                        <SidebarMenuSubButton
                          asChild
                          onClick={() => onPageClick?.(page.name)}
                        >
                          <Link href={`/${orgId}/events/${page.id}`}>
                            <span>{page.emoji}</span>
                            <span>{page.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
          {totalEvents > 5 && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-sidebar-foreground/70"
                onClick={handleMoreClick}
              >
                <MoreHorizontal />
                <span>{showAllEvents ? "Less" : "More"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
