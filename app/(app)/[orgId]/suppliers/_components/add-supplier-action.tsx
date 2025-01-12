"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { SupplierForm } from "@/components/forms/supplier-form";

import { Supplier, SupplierInsert } from "@/types";
import { createSupplier } from "../actions";

// Add Supplier Dialog
export function AddSupplierForm() {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { mutate: addSupplier, isPending } = useMutation({
    mutationFn: createSupplier,
    onMutate: async (newSupplier: SupplierInsert) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["org-suppliers"] });

      // Snapshot the previous value
      const previousSuppliers = queryClient.getQueryData<Supplier[]>([
        "org-suppliers",
      ]);

      // Create an optimistic supplier
      const optimisticSupplier: Supplier = {
        id: Date.now(), // Temporary ID
        name: newSupplier.name,
        category: newSupplier.category,
        contactName: newSupplier.contactName,
        email: newSupplier.email,
        phone: newSupplier.phone,
        address: newSupplier.address || null,
        description: newSupplier.description || null,
        website: newSupplier.website || null,
        isVerified: false,
        rating: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add empty services array since the Supplier type includes services
        services: [],
      };

      // Optimistically update the cache
      queryClient.setQueryData<Supplier[]>(["org-suppliers"], (old = []) => [
        ...old,
        optimisticSupplier,
      ]);
      setOpen(false);
      return { previousSuppliers };
    },
    onError: (err, newSupplier, context) => {
      // Rollback to the previous state on error
      if (context?.previousSuppliers) {
        queryClient.setQueryData(["org-suppliers"], context.previousSuppliers);
      }
      toast.error("Failed to add supplier", {
        description: err.message,
      });
      console.error("Error adding supplier:", err);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Supplier added successfully");
      } else {
        // If the server returns an error response
        toast.error(response.error || "Failed to add supplier");
      }
    },
    // Always refetch after error or success to ensure cache consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["org-suppliers"] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Add a new supplier to your organization's supplier list.
          </DialogDescription>
        </DialogHeader>
        <SupplierForm
          onSubmit={addSupplier}
          isSubmitting={isPending}
          submitLabel="Add Supplier"
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
