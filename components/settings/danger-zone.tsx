"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DangerZone({ orgId }: { orgId: string }) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteOrganization = useMutation({
    mutationFn: async () => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this organization? This action cannot be undone."
      );

      if (!confirmed) {
        return;
      }

      // This is just a placeholder response since the actual deletion isn't implemented
      return Promise.resolve({
        success: false,
        message: "Organization deletion not implemented yet",
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });

      // Show error message since deletion isn't implemented
      toast.error("Organization deletion not implemented yet");

      // If we had actual implementation, we would:
      // 1. Redirect to home/dashboard
      // 2. Show success message
      // router.push("/");
    },
    onError: (error) => {
      toast.error("Failed to delete organization");
      console.error("Delete organization error:", error);
    },
  });

  return (
    <div className="rounded-lg border border-destructive/50 p-4 mt-8">
      <h2 className="text-lg font-semibold text-destructive mb-4">
        Danger Zone
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Once you delete an organization, there is no going back. Please be
        certain.
      </p>
      <Button
        variant="destructive"
        onClick={() => deleteOrganization.mutate()}
        disabled={deleteOrganization.isPending}
      >
        {deleteOrganization.isPending ? "Deleting..." : "Delete Organization"}
      </Button>
    </div>
  );
}
