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
import { createSupplier } from "../../events/[eventId]/suppliers/actions";

// Add Supplier Dialog
export function AddSupplierForm() {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { mutate: addSupplier, isPending } = useMutation({
    mutationFn: createSupplier,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Supplier added successfully");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["org-suppliers"] });
      } else {
        toast.error(response.error || "Failed to add supplier");
      }
    },
    onError: (error) => {
      toast.error("Failed to add supplier");
      console.error("Error adding supplier:", error);
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
      <DialogContent className="sm:max-w-[500px]">
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
