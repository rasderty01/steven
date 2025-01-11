import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { getEvents } from "../../actions";
import { EventCard } from "./event-card";

export async function EventsList({ orgId }: { orgId: string }) {
  const events = await getEvents(orgId);

  if (events.length === 0) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-muted-foreground mb-4">No events found</p>
        <Link
          href={`/${orgId}/events/create`}
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}
        ></Link>
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
