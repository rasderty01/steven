// app/actions/organization.ts
"use server";

import { CreateOrgFormData } from "@/types/organization";
import { createServer } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createOrganization(data: CreateOrgFormData) {
  const { name, description } = data;
  const supabase = await createServer();

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Start a transaction to create organization and update user
    const { data: org, error: orgError } = await supabase.rpc(
      "create_organization",
      {
        name,
        description,
        owner_id: user.id,
      }
    );

    if (orgError) throw orgError;

    // Update user's orgId
    const { error: userError } = await supabase
      .from("User")
      .update({ orgId: org.id })
      .eq("id", user.id);

    if (userError) throw userError;

    revalidatePath(`/${org.id}/events/create`);
    return { success: true, data: org };
  } catch (error) {
    console.error("Error creating organization:", error);
    return { success: false, error: "Failed to create organization" };
  }
}
