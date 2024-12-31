// components/organization/QuickActions.tsx
"use client";

import { usePermissions } from "@/components/hooks/usePermissions";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Database } from "@/utils/supabase/database.types";
import {
  Calendar,
  CalendarPlus,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  orgId: string;
}

type OrgRole = Database["public"]["Enums"]["OrgRole"];

interface ActionButton {
  href: string;
  icon: React.ReactNode;
  label: string;
  allowedRoles: OrgRole[];
  disabledMessage: string;
}

export function QuickActions({ orgId }: QuickActionsProps) {
  const { role, isLoading } = usePermissions();

  const actionButtons: ActionButton[] = [
    {
      href: `/${orgId}/events`,
      icon: <Calendar />,
      label: "View All Events",
      allowedRoles: ["Owner", "Admin", "Member"], // All roles can view events
      disabledMessage: "", // Not needed since all roles can access
    },
    {
      href: `/${orgId}/events/create`,
      icon: <CalendarPlus />,
      label: "Create New Event",
      allowedRoles: ["Owner", "Admin"],
      disabledMessage: "You don't have permission to create events",
    },
    {
      href: `/${orgId}/settings/teams`,
      icon: <UserPlus />,
      label: "Invite Team Member",
      allowedRoles: ["Owner", "Admin"],
      disabledMessage: "Only Owners and Admins can invite team members",
    },
    {
      href: `/${orgId}/settings/teams`,
      icon: <Users />,
      label: "Manage Team",
      allowedRoles: ["Owner", "Admin"],
      disabledMessage: "Only Owners and Admins can manage the team",
    },
    {
      href: `/${orgId}/settings/general`,
      icon: <Settings />,
      label: "Organization Settings",
      allowedRoles: ["Owner"],
      disabledMessage: "Only Owners can access organization settings",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <TooltipProvider>
        {actionButtons.map((action, index) => {
          const hasPermission = role && action.allowedRoles.includes(role);

          if (!hasPermission) {
            return (
              <Tooltip key={index} delayDuration={0.5}>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-start opacity-50 cursor-not-allowed"
                    )}
                  >
                    {action.icon}
                    {action.label}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.disabledMessage}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={index}
              href={action.href}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start"
              )}
            >
              {action.icon}
              {action.label}
            </Link>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
