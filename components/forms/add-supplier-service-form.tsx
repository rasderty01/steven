"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  RateType,
  Supplier,
  SupplierServiceInsert,
  SupplierServiceRow,
} from "@/types";
import {
  addSupplierService,
  updateSupplierService,
} from "@/app/(app)/[orgId]/suppliers/actions";
import {
  supplierServiceForm,
  SupplierServiceValues,
} from "@/lib/schemas/supplier-service.schema";
import { useState } from "react";

interface SupplierServiceFormProps {
  supplierId: number;
  service?: SupplierServiceRow; // Optional for create mode
  children: React.ReactNode;
}

export function SupplierServiceForm({
  supplierId,
  service,
  children,
}: SupplierServiceFormProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { orgId } = useParams() as { orgId: string };
  const isEditing = !!service;

  const form = useForm<SupplierServiceValues>({
    resolver: zodResolver(supplierServiceForm),
    defaultValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      baseRate: service?.baseRate ?? 0,
      rateType: service?.rateType ?? "Hourly",
      minimumHours: service?.minimumHours ?? 0,
      maximumHours: service?.maximumHours ?? 0,
    },
  });

  const { mutate: mutateService, isPending } = useMutation({
    mutationFn: async (data: SupplierServiceValues) => {
      if (isEditing) {
        return updateSupplierService(service.id, parseInt(orgId), data);
      } else {
        const result = await addSupplierService(
          supplierId,
          parseInt(orgId),
          data as Omit<SupplierServiceInsert, "supplierId">
        );
        if (result.error) throw new Error(result.error);
        return result.data;
      }
    },

    onMutate: async (newService) => {
      await queryClient.cancelQueries({ queryKey: ["org-suppliers"] });
      const previousSuppliers = queryClient.getQueryData<Supplier[]>([
        "org-suppliers",
      ]);

      // Create optimistic service
      const optimisticService = {
        id: isEditing ? service.id : Date.now(),
        supplierId,
        name: newService.name,
        baseRate: newService.baseRate,
        rateType: newService.rateType,
        description: newService.description ?? null,
        createdAt: isEditing ? service.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        minimumHours: newService.minimumHours,
        maximumHours: newService.maximumHours,
      };

      // Update cache
      queryClient.setQueryData<Supplier[]>(["org-suppliers"], (old = []) =>
        old.map((supplier) => {
          if (supplier.id === supplierId) {
            const services = [...(supplier.services || [])];
            if (isEditing) {
              const index = services.findIndex((s) => s.id === service.id);
              if (index !== -1) services[index] = optimisticService;
            } else {
              services.push(optimisticService);
            }
            return { ...supplier, services };
          }
          return supplier;
        })
      );

      setOpen(false);
      return { previousSuppliers };
    },

    onError: (err, newService, context) => {
      if (context?.previousSuppliers) {
        queryClient.setQueryData(["org-suppliers"], context.previousSuppliers);
      }
      toast.error(`Failed to ${isEditing ? "update" : "add"} service`, {
        description: err.message,
      });
    },

    onSuccess: () => {
      toast.success(`Service ${isEditing ? "updated" : "added"} successfully`);
      form.reset();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["org-suppliers"] });
    },
  });

  function onSubmit(data: SupplierServiceValues) {
    mutateService(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Service" : "Add New Service"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update service details and rates."
              : "Add a new service offering with rates and details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields stay the same */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Basic Sound System Package"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rateType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rate type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hourly">Hourly</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                      <SelectItem value="PerPerson">Per Person</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Rate ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe what's included in this service..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("rateType") === "Hourly" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minimumHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min. Hours</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : 0
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maximumHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max. Hours</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : 0
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                    ? "Update Service"
                    : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
