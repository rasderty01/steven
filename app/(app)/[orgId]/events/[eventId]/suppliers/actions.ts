// actions/supplier.ts
"use server";

import {
  AddSupplierInput,
  UpdateSupplierInput,
  EventSupplierWithDetails,
} from "@/types";
import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Server action to add a supplier to an event
export async function addEventSupplier(params: AddSupplierInput) {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("EventSupplier")
    .insert(params)
    .select(
      `
      *,
      supplier:Supplier(*),
      service:SupplierService(*)
    `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/events/${params.eventId}/suppliers`);
  return data as EventSupplierWithDetails;
}

// Server action to remove a supplier from an event
export async function removeEventSupplier(
  eventSupplierId: number,
  eventId: number
) {
  const supabase = await createServer();

  const { error } = await supabase
    .from("EventSupplier")
    .delete()
    .eq("id", eventSupplierId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/events/${eventId}/suppliers`);
}

// Server action to update an event supplier
export async function updateEventSupplier(
  { id, ...params }: UpdateSupplierInput,
  eventId: number
) {
  const supabase = await createServer();

  const { error } = await supabase
    .from("EventSupplier")
    .update(params)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/events/${eventId}/suppliers`);
}
