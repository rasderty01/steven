"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Organization = Database["public"]["Tables"]["Organization"]["Row"];

export function GeneralTab({ organization }: { organization: Organization }) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: organization.name,
      description: organization.description || "",
    },
  });

  const updateOrganization = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("Organization")
        .update(data)
        .eq("id", organization.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", organization.id],
      });
      toast.success("Organization settings updated");
    },
    onError: () => {
      toast.error("Failed to update organization settings");
    },
  });

  return (
    <div className="rounded-lg p-4">
      <form
        onSubmit={handleSubmit((data) => updateOrganization.mutate(data))}
        className="space-y-4"
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Organization Name</label>
            <Input
              {...register("name")}
              placeholder="Enter organization name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Enter organization description"
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={updateOrganization.isPending}>
              {updateOrganization.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
