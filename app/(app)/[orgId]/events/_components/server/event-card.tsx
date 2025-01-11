import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { EventRow } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Calendar, Clock, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function EventCard({ event }: { event: EventRow }) {
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
        <Link
          href={`/${event.orgId}/events/${event.id}`}
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
