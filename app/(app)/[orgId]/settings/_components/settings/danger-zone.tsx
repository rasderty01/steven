"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteOrganization } from "./mutations";

export function DangerZone({ orgId }: { orgId: string }) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteOrganization = useDeleteOrganization(orgId);

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
