import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Database } from "@/utils/supabase/database.types";

import { Mail, Phone } from "lucide-react";

type EventRow = Database["public"]["Tables"]["Event"]["Row"];
type SeatingPlanRow = Database["public"]["Tables"]["SeatingPlan"]["Row"];
type GuestRow = Database["public"]["Tables"]["Guest"]["Row"];
type RSVPRow = Database["public"]["Tables"]["RSVP"]["Row"];

// Define types for what we actually select
type EventWithSeatingPlan = EventRow & {
  SeatingPlan: Pick<SeatingPlanRow, "id" | "seating_plan_name"> | null;
};

type GuestWithRSVP = GuestRow & {
  rsvp: Pick<RSVPRow, "attending" | "plusOne" | "dietaryPreferences"> | null;
};
export function AttendeesListComponent({
  guests,
}: {
  guests: GuestWithRSVP[];
}) {
  const getInitials = (firstName: string | null, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  const getRsvpStatusColor = (
    status: Database["public"]["Enums"]["RSVPStatus"] | null
  ) => {
    switch (status) {
      case "attending":
        return "bg-green-500";
      case "not attending":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Attendees ({guests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(guest.firstName, guest.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {guest.title && `${guest.title} `}
                        {guest.firstName} {guest.lastName}
                      </p>
                      {guest.role && (
                        <p className="text-sm text-muted-foreground">
                          {guest.role}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getRsvpStatusColor(guest.rsvp?.attending ?? "pending")} text-white`}
                  >
                    {guest.rsvp?.attending || "pending"}
                  </Badge>
                </TableCell>
                <TableCell>{guest.seatsReserved || 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {guest.email && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Mail className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>{guest.email}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {guest.phoneNumber && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Phone className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>{guest.phoneNumber}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
