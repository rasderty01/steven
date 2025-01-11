"use client";
import { Database } from "@/utils/supabase/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

import { addSupplierService } from "@/app/(app)/[orgId]/suppliers/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { RateType, SupplierServiceInsert } from "@/types";

interface AddSupplierServiceFormProps {
  supplierId: number;
}

export function AddSupplierServiceForm({
  supplierId,
}: AddSupplierServiceFormProps) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const form = useForm<Omit<SupplierServiceInsert, "supplierId">>();
  const { orgId } = useParams() as { orgId: string };

  const { mutate: addService, isPending } = useMutation({
    mutationFn: async (data: Omit<SupplierServiceInsert, "supplierId">) => {
      const result = await addSupplierService(
        supplierId,
        parseInt(orgId),
        data
      );
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Service added successfully");
      queryClient.invalidateQueries({ queryKey: ["org-suppliers"] });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to add service", {
        description: error.message,
      });
    },
  });

  function onSubmit(data: Omit<SupplierServiceInsert, "supplierId">) {
    addService(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add a Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Add a new service offering with rates and details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                {...form.register("name", { required: true })}
                placeholder="e.g. Basic Sound System Package"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rateType">Rate Type</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("rateType", value as RateType)
                }
                defaultValue={form.getValues("rateType")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hourly">Hourly</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="PerPerson">Per Person</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="baseRate">Base Rate ($)</Label>
              <Input
                id="baseRate"
                type="number"
                step="0.01"
                {...form.register("baseRate", {
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                })}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe what's included in this service..."
              />
            </div>
            {form.formState.errors.baseRate?.type === "min" && (
              <p className="text-sm text-red-500">
                Base rate must be a positive number
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
