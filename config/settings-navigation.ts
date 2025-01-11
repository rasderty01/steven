// config/settings-navigation.ts
import { OrgRole } from "@/types";
import { Database } from "@/utils/supabase/database.types";

export const settingsNavItems = [
  {
    title: "General",
    href: "/[orgId]/settings/general",
    allowedRoles: ["Owner", "Admin"] as OrgRole[],
  },
  {
    title: "Profile",
    href: "/[orgId]/settings/profile",
    // All roles can access profile
    allowedRoles: ["Owner", "Admin", "Member"] as OrgRole[],
  },
  {
    title: "Teams",
    href: "/[orgId]/settings/teams",
    allowedRoles: ["Owner", "Admin"] as OrgRole[],
  },
  {
    title: "Billing",
    href: "/[orgId]/settings/billing",
    allowedRoles: ["Owner"] as OrgRole[], // Only owners can access billing
  },
  {
    title: "Notifications",
    href: "/[orgId]/settings/notifications",
    // All roles can access notifications
    allowedRoles: ["Owner", "Admin", "Member"] as OrgRole[],
  },
];
