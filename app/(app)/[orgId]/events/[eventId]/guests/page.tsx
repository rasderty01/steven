import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { checkRole } from "@/utils/auth";
import { type Database } from "@/utils/supabase/database.types";
import { createServer } from "@/utils/supabase/server";
import { GuestHeader } from "./_components/guest-header";
import GuestTable from "./_components/guest-table";

type Guest = Database["public"]["Tables"]["Guest"]["Row"];
type RSVPStatus = Database["public"]["Enums"]["RSVPStatus"];

type GuestWithRSVP = Guest & {
  RSVP: {
    attending: RSVPStatus | null;
    dietaryPreferences: string | null;
    plusOne: boolean | null;
  } | null;
};

type GuestsPageProps = {
  params: {
    orgId: string;
    eventId: string;
  };
};

async function getGuests(eventId: string) {
  const supabase = await createServer();
  // First get all guests for the event
  const { data: guestsData, error: guestsError } = await supabase
    .from("Guest")
    .select(
      `
            *,
            RSVP!left (
                attending,
                dietaryPreferences,
                plusOne
            )
            `
    )
    .eq("eventId", eventId)
    .eq("is_deleted", false)
    .order("lastName");

  if (guestsError) throw guestsError;

  // Transform the data to match our expected type
  const transformedGuests: GuestWithRSVP[] = guestsData.map((guest) => ({
    ...guest,
    RSVP:
      Array.isArray(guest.RSVP) && guest.RSVP.length > 0 ? guest.RSVP[0] : null,
  }));

  return transformedGuests;
}

export default async function GuestsPage({ params }: GuestsPageProps) {
  const { orgId, eventId } = await params;

  const guests = await getGuests(eventId);

  await checkRole(orgId, ["Admin", "Owner", "Member"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guests</CardTitle>
      </CardHeader>
      <CardContent>
        <GuestHeader />
        <GuestTable guests={guests || []} />
      </CardContent>
    </Card>
  );
}
