"use server";

import { Database } from "@/utils/supabase/database.types";
import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type SupplierServiceInsert =
  Database["public"]["Tables"]["SupplierService"]["Insert"];
type RateType = Database["public"]["Enums"]["RateType"];
type EventPermission = Database["public"]["Enums"]["EventPermissions"];

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
  data: Partial<Database["public"]["Tables"]["Supplier"]["Update"]>
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
