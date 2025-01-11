// app/[orgId]/events/page.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { EventsSkeleton } from "./_components/skeleton/events-skeleton";
import { getUserRole } from "./actions";
import { EventsList } from "./_components/server/event-list";

export default async function EventsPage({
  params,
}: {
  params: { orgId: string };
}) {
  const { orgId } = await params;
  const userRole = await getUserRole(orgId);
  const canCreateEvent = userRole === "Owner" || userRole === "Admin";

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        {canCreateEvent && (
          <Link href={`/${orgId}/events/create`}>
            <Button>Create New Event</Button>
          </Link>
        )}
      </div>

      <Suspense fallback={<EventsSkeleton />}>
        <EventsList orgId={orgId} />
      </Suspense>
    </div>
  );
}
