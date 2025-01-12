"use client";

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
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2 } from "lucide-react";
import { RateType, SupplierServiceRow, Supplier } from "@/types";
import { updateSupplierService } from "../actions";
import { useState } from "react";

// We need to create this action

interface EditSupplierServiceProps {
  service: SupplierServiceRow;
}

export function EditSupplierService({ service }: EditSupplierServiceProps) {
  const queryClient = useQueryClient();
  const [open, onOpenChange] = useState(false);
  const { orgId } = useParams() as { orgId: string };

  const form = useForm<Partial<SupplierServiceRow>>({
    defaultValues: {
      name: service.name,
      description: service.description,
      baseRate: service.baseRate,
      rateType: service.rateType,
      minimumHours: service.minimumHours,
      maximumHours: service.maximumHours,
    },
  });

  const { mutate: updateService, isPending } = useMutation({
    mutationFn: (data: Partial<SupplierServiceRow>) =>
      updateSupplierService(service.id, parseInt(orgId), data),

    onMutate: async (updatedService) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["org-suppliers"] });

      // Snapshot the previous value
      const previousSuppliers = queryClient.getQueryData<Supplier[]>([
        "org-suppliers",
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<Supplier[]>(["org-suppliers"], (old = []) =>
        old.map((supplier) => {
          if (supplier.id === service.supplierId) {
            return {
              ...supplier,
              services: (supplier.services || []).map((s) =>
                s.id === service.id ? { ...s, ...updatedService } : s
              ),
            };
          }
          return supplier;
        })
      );

      return { previousSuppliers };
    },

    onError: (err, newData, context) => {
      // Rollback to the previous state on error
      if (context?.previousSuppliers) {
        queryClient.setQueryData(["org-suppliers"], context.previousSuppliers);
      }
      toast.error("Failed to update service", {
        description: err.message,
      });
    },

    onSuccess: () => {
      toast.success("Service updated successfully");
      onOpenChange(false);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["org-suppliers"] });
    },
  });

  function onSubmit(data: Partial<SupplierServiceRow>) {
    updateService(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild> Edit Service </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update service details and rates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input id="name" {...form.register("name", { required: true })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rateType">Rate Type</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("rateType", value as RateType)
                }
                defaultValue={service.rateType}
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" {...form.register("description")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minimumHours">Min. Hours</Label>
                <Input
                  id="minimumHours"
                  type="number"
                  {...form.register("minimumHours", {
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maximumHours">Max. Hours</Label>
                <Input
                  id="maximumHours"
                  type="number"
                  {...form.register("maximumHours", {
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
