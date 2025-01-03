// app/api/guests/batch/route.ts

import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServer();
  try {
    const { guests, eventId } = await request.json();

    if (!Array.isArray(guests) || !eventId) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get event and check permissions
    const { data: event, error: eventError } = await supabase
      .from("Event")
      .select("*, Guest(*), User(*)")
      .eq("id", eventId)
      .eq("is_deleted", false)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const currentUser = await supabase.auth.getUser();
    if (!currentUser.data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check guest limits
    const currentGuestCount = event.Guest?.length || 0;
    const userSubscriptionStatus = event.User?.subscriptionStatus || "Starter";

    const guestLimits = {
      Starter: 100,
      StarterPlus: 300,
      Pro: 500,
      Enterprise: 1000,
    };

    const guestLimit =
      guestLimits[userSubscriptionStatus as keyof typeof guestLimits];
    const remainingCapacity = guestLimit - currentGuestCount;

    if (guests.length > remainingCapacity) {
      return NextResponse.json(
        {
          error: `Cannot add ${guests.length} guests. Only ${remainingCapacity} spots remaining.`,
        },
        { status: 400 }
      );
    }

    // Insert guests
    const { data: insertedGuests, error: insertError } = await supabase
      .from("Guest")
      .insert(guests)
      .select();

    if (insertError) {
      throw insertError;
    }

    // Create RSVPs for new guests
    if (insertedGuests) {
      await supabase.from("RSVP").insert(
        insertedGuests.map((guest) => ({
          guestId: guest.id,
          eventId,
          attending: "pending" as "attending" | "not attending" | "pending",
        }))
      );
    }

    // Record import history
    await supabase.from("import_history").insert({
      event_id: eventId,
      user_id: currentUser.data.user.id,
      imported_at: new Date().toISOString(),
      records_imported: guests.length,
    });

    revalidatePath(`/[orgId]/events/[eventId]/guests`, "page");

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${guests.length} guests`,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import guests" },
      { status: 500 }
    );
  }
}
