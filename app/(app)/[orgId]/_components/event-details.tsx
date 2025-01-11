import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/utils/supabase/database.types";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Link as LinkIcon, MapPin, Users } from "lucide-react";
import { EventWithSeatingPlan } from "@/types";

export function EventDetailsComponent({
  event,
}: {
  event: EventWithSeatingPlan;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <CardDescription className="mt-2">
              {event.description}
            </CardDescription>
          </div>
          <Badge
            variant={event.status === "Published" ? "default" : "secondary"}
          >
            {event.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time and Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>
              {format(new Date(event.startTime), "EEEE, MMMM d, yyyy")} -{" "}
              {format(new Date(event.endTime), "EEEE, MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>
              {format(new Date(event.startTime), "h:mm a")} -{" "}
              {format(new Date(event.endTime), "h:mm a")}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          )}
          {event.isVirtual && (
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <span>Virtual Event</span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>Guest Limit: {event.guestLimit || "Unlimited"}</span>
          </div>
          {event.seatingPlanId && event.SeatingPlan && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>Seating Plan: {event.SeatingPlan.seating_plan_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>
              Created{" "}
              {formatDistanceToNow(new Date(event.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
