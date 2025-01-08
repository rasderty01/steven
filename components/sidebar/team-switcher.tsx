"use client";

import { ChevronDown, Command, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { updateUserMetadata } from "@/utils/metadata";

interface Team {
  id: number;
  name: string;
  logo_url: string | null;
  plan: string;
}

const TeamLogo = ({ team }: { team: Team }) => {
  if (team.logo_url) {
    return (
      <Image
        src={team.logo_url}
        alt={`${team.name} logo`}
        width={16}
        height={16}
        className="size-4 rounded-sm object-contain"
      />
    );
  }

  // Fallback to Command icon if no logo_url
  return <Command className="size-4" />;
};

export function TeamSwitcher({
  teams,
  currentOrgId,
}: {
  teams: Team[];
  currentOrgId: string;
}) {
  const router = useRouter();
  const activeTeam =
    teams.find((team) => team.id === parseInt(currentOrgId)) ?? teams[0];

  const handleTeamChange = async (team: Team) => {
    await updateUserMetadata({
      currentOrgId: team.id.toString(),
      currentEventId: undefined,
    });

    router.push(`/${team.id}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <TeamLogo team={activeTeam} />
              </div>
              <span className="truncate font-semibold">{activeTeam.name}</span>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleTeamChange(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <TeamLogo team={team} />
                </div>
                <span className="flex-1">{team.name}</span>
                <span className="text-xs text-muted-foreground">
                  {team.plan}
                </span>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/create-org" className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">New Org</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
