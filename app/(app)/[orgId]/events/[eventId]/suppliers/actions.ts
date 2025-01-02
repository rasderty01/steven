// app/[orgId]/events/[eventId]/suppliers/actions.ts
"use server";

import {
  SupplierCategory,
  SupplierFormValues,
  supplierSchema,
} from "@/lib/schemas/supplier";
import { Database } from "@/utils/supabase/database.types";
import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type SupplierInsert = Database["public"]["Tables"]["Supplier"]["Insert"];

export async function createSupplier(formData: SupplierFormValues) {
  try {
    // Server-side validation
    const validatedData = supplierSchema.parse(formData);

    const supabase = await createServer();

    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error("Unauthorized");
    }

    // Prepare data according to database schema
    const supplierData: SupplierInsert = {
      name: validatedData.name,
      category: validatedData.category as SupplierCategory,
      contactName: validatedData.contactName,
      email: validatedData.email,
      phone: validatedData.phone,
      description: validatedData.description || null,
      website: validatedData.website || null,
      address: validatedData.address || null,
    };

    // Insert supplier
    const { data: supplier, error: supplierError } = await supabase
      .from("Supplier")
      .insert(supplierData)
      .select()
      .single();

    if (supplierError) {
      throw new Error(supplierError.message);
    }

    revalidatePath("/[orgId]/events/[eventId]/suppliers");

    return { success: true, data: supplier };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something went wrong" };
  }
}
