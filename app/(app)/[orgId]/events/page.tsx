// app/[orgId]/events/page.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/utils/supabase/database.types";
import { createServer } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { EventRow, OrgRole } from "@/types";

async function getUserRole(orgId: string) {
  const supabase = await createServer();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user's role in the organization
  const { data: memberData } = await supabase
    .from("OrganizationMember")
    .select("role")
    .eq("userId", user.id)
    .eq("orgId", orgId)
    .single();

  return memberData?.role as OrgRole | null;
}

async function getEvents(orgId: string) {
  const supabase = await createServer();

  const { data: events, error } = await supabase
    .from("Event")
    .select("*")
    .eq("orgId", orgId)
    .eq("is_deleted", false)
    .order("startTime", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return events;
}

function EventCard({ event }: { event: EventRow }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
          <Badge
            variant={event.status === "Published" ? "default" : "secondary"}
          >
            {event.status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(event.startTime), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/${event.orgId}/events/${event.id}`} className="w-full">
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function EventsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function EventsList({ orgId }: { orgId: string }) {
  const events = await getEvents(orgId);

  if (events.length === 0) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-muted-foreground mb-4">No events found</p>
        <Link href={`/${orgId}/events/create`}>
          <Button>Create New Event</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

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
