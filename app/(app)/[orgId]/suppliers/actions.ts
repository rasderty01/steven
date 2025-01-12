"use server";

import {
  SupplierFormValues,
  supplierSchema,
} from "@/lib/schemas/supplier.schema";
import {
  RateType,
  SupplierCategory,
  SupplierInsert,
  SupplierServiceInsert,
  SupplierUpdate,
} from "@/types";
import { Database } from "@/utils/supabase/database.types";
import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addSupplierService(
  supplierId: number,
  orgId: number,
  data: Omit<SupplierServiceInsert, "supplierId">
) {
  const supabase = await createServer();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Get user's org role and permissions with orgId check
    const { data: memberData } = await supabase
      .from("OrganizationMember")
      .select("role")
      .eq("userId", session.user.id)
      .eq("orgId", orgId)
      .single();

    if (!memberData || !["Owner", "Admin"].includes(memberData.role)) {
      throw new Error("Insufficient permissions");
    }

    // Validate required fields
    if (!data.name || !data.baseRate || !data.rateType) {
      throw new Error("Missing required fields");
    }

    // Validate rate type
    const validRateTypes: RateType[] = [
      "Hourly",
      "Daily",
      "Fixed",
      "PerPerson",
      "Custom",
    ];
    if (!validRateTypes.includes(data.rateType)) {
      throw new Error("Invalid rate type");
    }

    const { data: newService, error } = await supabase
      .from("SupplierService")
      .insert({
        ...data,
        supplierId,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/[orgId]/suppliers");
    return { data: newService, error: null };
  } catch (error) {
    console.error("Error adding supplier service:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateSupplierService(
  serviceId: number,
  orgId: number,
  data: Partial<Omit<SupplierServiceInsert, "supplierId">>
) {
  const supabase = await createServer();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { data: memberData } = await supabase
      .from("OrganizationMember")
      .select("role")
      .eq("userId", session.user.id)
      .eq("orgId", orgId)
      .single();

    if (!memberData || !["Owner", "Admin"].includes(memberData.role)) {
      throw new Error("Insufficient permissions");
    }

    const { data: updatedService, error } = await supabase
      .from("SupplierService")
      .update(data)
      .eq("id", serviceId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/[orgId]/suppliers");
    return { data: updatedService, error: null };
  } catch (error) {
    console.error("Error updating supplier service:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function verifySupplier(supplierId: number, orgId: number) {
  const supabase = await createServer();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { data: memberData } = await supabase
      .from("OrganizationMember")
      .select("role")
      .eq("userId", session.user.id)
      .eq("orgId", orgId)
      .single();

    if (!memberData || !["Owner", "Admin"].includes(memberData.role)) {
      throw new Error("Insufficient permissions");
    }

    const { data: updatedSupplier, error } = await supabase
      .from("Supplier")
      .update({
        isVerified: true,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", supplierId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/[orgId]/suppliers");
    return { data: updatedSupplier, error: null };
  } catch (error) {
    console.error("Error verifying supplier:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeSupplier(supplierId: number, orgId: number) {
  const supabase = await createServer();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { data: memberData } = await supabase
      .from("OrganizationMember")
      .select("role")
      .eq("userId", session.user.id)
      .eq("orgId", orgId)
      .single();

    if (!memberData || !["Owner", "Admin"].includes(memberData.role)) {
      throw new Error("Insufficient permissions");
    }

    // First delete all services associated with this supplier
    await supabase
      .from("SupplierService")
      .delete()
      .eq("supplierId", supplierId);

    // Then delete the supplier
    const { error } = await supabase
      .from("Supplier")
      .delete()
      .eq("id", supplierId);

    if (error) throw error;

    revalidatePath("/[orgId]/suppliers");
    return { error: null };
  } catch (error) {
    console.error("Error removing supplier:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateSupplier(
  supplierId: number,
  orgId: number,
  data: SupplierUpdate
) {
  const supabase = await createServer();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { data: memberData } = await supabase
      .from("OrganizationMember")
      .select("role")
      .eq("userId", session.user.id)
      .eq("orgId", orgId)
      .single();

    if (!memberData || !["Owner", "Admin"].includes(memberData.role)) {
      throw new Error("Insufficient permissions");
    }

    const { data: updatedSupplier, error } = await supabase
      .from("Supplier")
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", supplierId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/[orgId]/suppliers");
    return { data: updatedSupplier, error: null };
  } catch (error) {
    console.error("Error updating supplier:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteSupplierService(serviceId: number, orgId: number) {
  const supabase = await createServer();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { data: memberData } = await supabase
      .from("OrganizationMember")
      .select("role")
      .eq("userId", session.user.id)
      .eq("orgId", orgId)
      .single();

    console.log(memberData);

    if (!memberData || !["Owner", "Admin"].includes(memberData.role)) {
      throw new Error("Insufficient permissions");
    }

    const { error } = await supabase
      .from("SupplierService")
      .delete()
      .eq("id", serviceId);

    if (error) throw error;

    revalidatePath("/[orgId]/suppliers");
    return { error: null };
  } catch (error) {
    console.error("Error deleting supplier service:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

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
