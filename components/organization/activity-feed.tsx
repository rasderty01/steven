// components/organization/ActivityFeed.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EventRow, UserRow } from "@/types";
import { CalendarDays } from "lucide-react";

interface ActivityFeedProps {
  events: Array<
    Pick<EventRow, "id" | "title" | "startTime" | "endTime" | "status"> & {
      User: Pick<UserRow, "name" | "email">;
    }
  >;
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <CalendarDays className="h-12 w-12 mb-2" />
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {events.map((event) => (
        <div key={event.id} className="flex items-start">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {event.User.name?.[0] || event.User.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">{event.title}</p>
            <p className="text-sm text-muted-foreground">
              Created by {event.User.name || event.User.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(event.startTime).toLocaleDateString()} -{" "}
              {new Date(event.endTime).toLocaleDateString()}
            </p>
          </div>
          <div className="ml-auto">
            <span
              className={`text-xs ${
                event.status === "Published"
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              {event.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
