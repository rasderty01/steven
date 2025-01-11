import { OrgRole } from "@/types";
import { createServer } from "@/utils/supabase/server";

export async function getUserRole(orgId: string) {
  const supabase = await createServer();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user's role in the organization
  const { data: memberData } = await supabase
    .from("OrganizationMember")
    .select("role")
    .eq("userId", user.id)
    .eq("orgId", orgId)
    .single();

  return memberData?.role as OrgRole | null;
}

export async function getEvents(orgId: string) {
  const supabase = await createServer();

  const { data: events, error } = await supabase
    .from("Event")
    .select("*")
    .eq("orgId", orgId)
    .eq("is_deleted", false)
    .order("startTime", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return events;
}
