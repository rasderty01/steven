import { Suspense } from "react";
import { getEventAttendees, getEventDetails } from "./actions";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { AttendeesListComponent } from "../../_components/attendees-list";
import { EventDetailsComponent } from "../../_components/event-details";

interface PageProps {
  params: {
    orgId: string;
    eventId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { orgId, eventId } = await params;

  // Fetch event details and attendees in parallel
  const [event, attendees] = await Promise.all([
    getEventDetails(eventId),
    getEventAttendees(eventId),
  ]);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Event Details</h1>
        <div className="flex items-center gap-2">
          <Link href={`/${orgId}/events/${eventId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
          </Link>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Event
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<div>Loading event details...</div>}>
          <EventDetailsComponent event={event} />
        </Suspense>

        <Suspense fallback={<div>Loading attendees...</div>}>
          <AttendeesListComponent guests={attendees} />
        </Suspense>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Event Details",
  description: "View and manage event details",
};
