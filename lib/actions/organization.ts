// app/actions/organization.ts
"use server";

import { CreateOrgFormData } from "@/lib/schemas/organization.schema";
import { OrganizationRow } from "@/types";
import { Database } from "@/utils/supabase/database.types";
import { createServer } from "@/utils/supabase/server";

import { revalidatePath } from "next/cache";
import { cache } from "react";

// Type for organization stats
interface OrganizationStats {
  organization: OrganizationRow;
  stats: {
    memberCount: number;
    activeEventsCount: number;
    recentEvents: Array<{
      id: number;
      title: string;
      startTime: string;
      endTime: string;
      status: "Draft" | "Published";
      User: {
        name: string | null;
        email: string;
      };
    }>;
  };
}

// Create organization
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

// Get organization data with stats
export const getOrganizationData = cache(
  async (orgId: string): Promise<OrganizationStats> => {
    const supabase = await createServer();

    try {
      // Fetch organization details
      const { data: org, error: orgError } = await supabase
        .from("Organization")
        .select("*")
        .eq("id", orgId)
        .single();

      if (orgError) throw orgError;

      // Fetch member count
      const { count: memberCount, error: memberError } = await supabase
        .from("OrganizationMember")
        .select("*", { count: "exact" })
        .eq("orgId", orgId)
        .eq("status", "Active");

      if (memberError) throw memberError;

      // Fetch active events count
      const { count: activeEventsCount, error: eventError } = await supabase
        .from("Event")
        .select("*", { count: "exact" })
        .eq("orgId", orgId)
        .eq("status", "Published")
        .eq("is_deleted", false)
        .gte("endTime", new Date().toISOString());

      if (eventError) throw eventError;

      // Fetch recent activity (last 7 days of events)
      const { data: recentEvents, error: recentError } = await supabase
        .from("Event")
        .select(
          `
        id,
        title,
        startTime,
        endTime,
        status,
        User (
          name,
          email
        )
      `
        )
        .eq("orgId", orgId)
        .eq("is_deleted", false)
        .gte(
          "createdAt",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        )
        .order("createdAt", { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      return {
        organization: org,
        stats: {
          memberCount: memberCount || 0,
          activeEventsCount: activeEventsCount || 0,
          recentEvents: recentEvents || [],
        },
      };
    } catch (error) {
      console.error("Error fetching organization data:", error);
      throw error;
    }
  }
);

// Helper function to check if user is organization member
export async function isOrganizationMember(userId: string, orgId: string) {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("OrganizationMember")
    .select("*")
    .eq("userId", userId)
    .eq("orgId", orgId)
    .eq("status", "Active")
    .single();

  if (error) {
    console.error("Error checking organization membership:", error);
    return false;
  }

  return !!data;
}
