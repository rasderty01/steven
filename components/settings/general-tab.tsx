"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useOrganizationDetails } from "./queries";
import { useUpdateOrganization } from "./mutations";

interface GeneralTabProps {
  orgId: string;
}

export function GeneralTab({ orgId }: GeneralTabProps) {
  const { data: organization, isLoading } = useOrganizationDetails(orgId);
  const updateOrganization = useUpdateOrganization(orgId);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: organization?.name || "",
      description: organization?.description || "",
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
