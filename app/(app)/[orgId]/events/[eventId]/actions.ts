"use server";

import { Database } from "@/utils/supabase/database.types";
import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Base types from database
type EventRow = Database["public"]["Tables"]["Event"]["Row"];
type SeatingPlanRow = Database["public"]["Tables"]["SeatingPlan"]["Row"];
type GuestRow = Database["public"]["Tables"]["Guest"]["Row"];
type RSVPRow = Database["public"]["Tables"]["RSVP"]["Row"];

// Extended types with relationships
type EventWithSeatingPlan = EventRow & {
  SeatingPlan: Pick<SeatingPlanRow, "id" | "seating_plan_name"> | null;
};

type GuestWithRSVP = GuestRow & {
  rsvp: Pick<RSVPRow, "attending" | "plusOne" | "dietaryPreferences"> | null;
};

export async function getEventDetails(
  eventId: string
): Promise<EventWithSeatingPlan> {
  const supabase = await createServer();

  try {
    // First, get the event details
    const { data: event, error } = await supabase
      .from("Event")
      .select(`*`)
      .eq("id", eventId)
      .eq("is_deleted", false)
      .single();

    if (error) {
      throw new Error(`Error fetching event: ${error.message}`);
    }

    if (!event) {
      throw new Error("Event not found");
    }

    // If there's a seating plan ID, fetch the seating plan separately
    if (event.seatingPlanId) {
      const { data: seatingPlan, error: seatingPlanError } = await supabase
        .from("SeatingPlan")
        .select(`id, seating_plan_name`)
        .eq("id", event.seatingPlanId)
        .single();

      if (seatingPlanError) {
        console.error("Error fetching seating plan:", seatingPlanError);
        return {
          ...event,
          SeatingPlan: null,
        };
      }

      return {
        ...event,
        SeatingPlan: seatingPlan,
      };
    }

    return {
      ...event,
      SeatingPlan: null,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getEventAttendees(
  eventId: string
): Promise<GuestWithRSVP[]> {
  const supabase = await createServer();

  try {
    const { data: guests, error } = await supabase
      .from("Guest")
      .select(
        `
        *,
        rsvp:RSVP!left(
          attending,
          plusOne,
          dietaryPreferences
        )
      `
      )
      .eq("eventId", eventId)
      .eq("is_deleted", false)
      .order("lastName", { ascending: true });

    if (error) {
      throw new Error(`Error fetching attendees: ${error.message}`);
    }

    if (!guests) {
      return [];
    }

    // Transform the response to match our GuestWithRSVP type
    return guests.map((guest) => ({
      ...guest,
      rsvp: guest.rsvp ? guest.rsvp[0] : null,
    })) as GuestWithRSVP[];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function updateEventDetails(
  eventId: string,
  data: Partial<EventRow>
): Promise<void> {
  const supabase = await createServer();

  try {
    const { error } = await supabase
      .from("Event")
      .update(data)
      .eq("id", eventId)
      .eq("is_deleted", false);

    if (error) {
      throw new Error(`Error updating event: ${error.message}`);
    }

    revalidatePath(`/[orgId]/events/[eventId]`);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  const supabase = await createServer();

  try {
    const { error } = await supabase.rpc("soft_delete_event", {
      event_id: parseInt(eventId),
    });

    if (error) {
      throw new Error(`Error deleting event: ${error.message}`);
    }

    revalidatePath(`/[orgId]/events`);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function checkEventAccess(
  userId: string,
  eventId: string,
  requiredPermission: Database["public"]["Enums"]["EventPermissions"]
): Promise<boolean> {
  const supabase = await createServer();

  try {
    const { data, error } = await supabase.rpc("check_event_permission", {
      user_id: userId,
      event_id: parseInt(eventId),
      required_permission: requiredPermission,
    });

    if (error) {
      throw new Error(`Error checking permissions: ${error.message}`);
    }

    return !!data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Additional helper functions for RSVP management
export async function updateRSVP(
  guestId: number,
  eventId: string,
  status: Database["public"]["Enums"]["RSVPStatus"],
  plusOne?: boolean,
  dietaryPreferences?: string
): Promise<void> {
  const supabase = await createServer();

  try {
    const { error } = await supabase.from("RSVP").upsert({
      guestId,
      eventId: parseInt(eventId),
      attending: status,
      plusOne,
      dietaryPreferences,
      updatedAt: new Date().toISOString(),
    });

    if (error) {
      throw new Error(`Error updating RSVP: ${error.message}`);
    }

    revalidatePath(`/[orgId]/events/[eventId]`);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Function to get event statistics
export async function getEventStats(eventId: string) {
  const supabase = await createServer();

  try {
    const { data: guests, error } = await supabase
      .from("Guest")
      .select(
        `
        *,
        rsvp:RSVP!left(attending)
      `
      )
      .eq("eventId", eventId)
      .eq("is_deleted", false);

    if (error) {
      throw new Error(`Error fetching event stats: ${error.message}`);
    }

    if (!guests) {
      return {
        total: 0,
        attending: 0,
        notAttending: 0,
        pending: 0,
      };
    }

    return {
      total: guests.length,
      attending: guests.filter((g) => g.rsvp?.[0]?.attending === "attending")
        .length,
      notAttending: guests.filter(
        (g) => g.rsvp?.[0]?.attending === "not attending"
      ).length,
      pending: guests.filter((g) => !g.rsvp?.[0]?.attending).length,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
