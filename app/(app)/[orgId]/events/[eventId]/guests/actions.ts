// app/[orgId]/events/[eventId]/guests/actions.ts
"use server";

import { createServer } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/database.types";
import { revalidatePath } from "next/cache";
import { GuestWithRSVP } from "@/types/guest";

type Guest = Database["public"]["Tables"]["Guest"]["Row"];
type RSVP = Database["public"]["Tables"]["RSVP"]["Row"];
type RSVPStatus = Database["public"]["Enums"]["RSVPStatus"];

export async function updateGuestRSVP({
  guestId,
  eventId,
  rsvpStatus,
}: {
  guestId: number;
  eventId: number;
  rsvpStatus: RSVPStatus;
}) {
  const supabase = await createServer();

  // First, check if RSVP exists
  const { data: existingRSVP, error } = await supabase
    .from("RSVP")
    .select()
    .eq("guestId", guestId)
    .eq("eventId", eventId)
    .single();

  console.log(error);

  if (existingRSVP) {
    // Update existing RSVP
    const { error } = await supabase
      .from("RSVP")
      .update({
        attending: rsvpStatus,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", existingRSVP.id);

    if (error) throw error;
  } else {
    // Create new RSVP
    const { error } = await supabase.from("RSVP").insert({
      guestId,
      eventId,
      attending: rsvpStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (error) throw error;
  }

  revalidatePath(`/events/${eventId}/guests`);
  return { success: true };
}

export async function deleteGuest({
  guestId,
  eventId,
}: {
  guestId: number;
  eventId: number;
}) {
  const supabase = await createServer();

  // Begin transaction by soft deleting the guest
  const { error: guestError } = await supabase
    .from("Guest")
    .update({
      is_deleted: true,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", guestId)
    .eq("eventId", eventId);

  if (guestError) throw guestError;

  // Soft delete associated RSVP if it exists
  const { error: rsvpError } = await supabase
    .from("RSVP")
    .update({
      is_deleted: true,
      updatedAt: new Date().toISOString(),
    })
    .eq("guestId", guestId)
    .eq("eventId", eventId);

  if (rsvpError) throw rsvpError;

  revalidatePath(`/events/${eventId}/guests`);
  return { success: true };
}

export async function getGuests(eventId: string) {
  const supabase = await createServer();
  // First get all guests for the event
  const { data: guestsData, error: guestsError } = await supabase
    .from("Guest")
    .select(
      `
            *,
            RSVP!left (
            id,
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
