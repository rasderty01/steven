// components/settings/mutations.ts
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "./queries";

const supabase = createClient();

type Organization = Database["public"]["Tables"]["Organization"]["Row"];
type OrganizationUpdate = Pick<Organization, "name" | "description">;

export function useUpdateOrganization(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: OrganizationUpdate) => {
      const { error } = await supabase
        .from("Organization")
        .update(data)
        .eq("id", orgId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organization.details(orgId),
      });
      toast.success("Organization settings updated");
    },
    onError: () => {
      toast.error("Failed to update organization settings");
    },
  });
}

export function useDeleteOrganization(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this organization? This action cannot be undone."
      );

      if (!confirmed) {
        throw new Error("User cancelled deletion");
      }

      // Implement the actual deletion logic here
      const { error } = await supabase
        .from("Organization")
        .delete()
        .eq("id", orgId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.organization.details(orgId),
      });
      toast.success("Organization deleted successfully");
    },
    onError: (error) => {
      if (error.message === "User cancelled deletion") return;

      toast.error("Failed to delete organization");
      console.error("Delete organization error:", error);
    },
  });
}

export function useUpgradeSubscription() {
  return useMutation({
    mutationFn: async ({ plan, orgId }: { plan: string; orgId: string }) => {
      // Implement your payment/upgrade logic here
      toast.info(`Upgrading to ${plan}. Implement payment flow here.`);
    },
  });
}
