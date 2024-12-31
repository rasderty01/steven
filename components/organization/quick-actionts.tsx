// components/organization/QuickActions.tsx
import { Button } from "@/components/ui/button";
import { CalendarPlus, Settings, UserPlus, Users } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  orgId: string;
}

export function QuickActions({ orgId }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Link href={`/${orgId}/events/create`}>
        <Button variant="outline" className="w-full justify-start">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create New Event
        </Button>
      </Link>

      <Link href={`/${orgId}/settings/teams`}>
        <Button variant="outline" className="w-full justify-start">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Team Member
        </Button>
      </Link>

      <Link href={`/${orgId}/settings/teams`}>
        <Button variant="outline" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Manage Team
        </Button>
      </Link>

      <Link href={`/${orgId}/settings/general`}>
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Organization Settings
        </Button>
      </Link>
    </div>
  );
}
