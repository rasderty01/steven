// components/settings/sidebar-settings.tsx
"use client";

import { usePermissions } from "@/components/hooks/usePermissions";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { OrgRole } from "@/types";
import { Database } from "@/utils/supabase/database.types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    allowedRoles: OrgRole[];
  }[];
  orgId: string;
}

export default function SidebarNav({ items, orgId }: SidebarNavProps) {
  const pathname = usePathname();
  const { role, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item) => {
        // Show the item if the user's role is included in allowedRoles
        if (!role || !item.allowedRoles.includes(role)) {
          return null;
        }

        const href = item.href.replace("[orgId]", orgId);
        const isActive = pathname === href;

        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              isActive
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
