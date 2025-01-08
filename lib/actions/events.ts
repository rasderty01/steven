"use server";
import { CreateEventFormData } from "@/types/events";
import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(
  data: CreateEventFormData & { orgId: string }
) {
  try {
    const supabase = await createServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data: event, error } = await supabase
      .from("Event")
      .insert({
        title: data.title,
        description: data.description,
        location: data.location,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        isVirtual: data.isVirtual,
        orgId: parseInt(data.orgId),
        userId: user.id,
        status: "Draft",
      })
      .select("id, orgId")
      .single();

    if (error) throw error;

    revalidatePath(`${event.orgId}/events/${event.id}`, "layout");

    return { success: true, data: { id: event.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create event",
    };
  }
}
