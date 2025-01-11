// components/sidebar/queries.ts
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { EventRow, Team } from "@/types";
import { UserProfile } from "@/types/user.types";

const supabase = createClient();

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error("No user found");

      const { data: profile, error: profileError } = await supabase
        .from("User")
        .select("name, email, subscriptionStatus")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      return {
        name: profile.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        subscriptionStatus: profile.subscriptionStatus,
        avatar: user.user_metadata.avatar_url,
      } as UserProfile;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });
}

export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.organization.list,
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("OrganizationMember")
        .select(
          `
          organization:Organization(
            id,
            name,
            description,
            logo_url
          ),
          User!inner(
            subscriptionStatus
          )
        `
        )
        .eq("userId", user.id);

      if (error) throw error;

      return data?.map((item) => ({
        id: item.organization.id,
        name: item.organization.name,
        logo_url: item.organization.logo_url,
        plan: item.User.subscriptionStatus,
      })) as Team[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useOrganizationEvents(orgId: string) {
  return useQuery<EventRow[]>({
    queryKey: queryKeys.events.byOrg(orgId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Event")
        .select("*")
        .eq("orgId", orgId)
        .eq("is_deleted", false)
        .order("startTime", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

// Helper function to transform events for sidebar display
export function transformEventsForSidebar(events: EventRow[]) {
  return events.map((event) => ({
    id: event.id,
    name: event.title,
    emoji: (event.status === "Draft" ? "📝" : "📅") as React.ReactNode,
    startTime: event.startTime,
  }));
}
