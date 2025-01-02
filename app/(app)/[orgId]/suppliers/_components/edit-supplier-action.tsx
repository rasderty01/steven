"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

import { SupplierForm } from "@/components/forms/supplier-form";
import { SupplierFormValues } from "@/lib/schemas/supplier";
import { useParams } from "next/navigation";
import { updateSupplier } from "../actions";
import { Supplier } from "./SuppliersList";

interface EditSupplierProps {
  supplier: Supplier;
}

export function EditSupplier({ supplier }: EditSupplierProps) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { orgId } = useParams() as { orgId: string };

  const { mutate: editSupplier, isPending } = useMutation({
    mutationFn: async (data: SupplierFormValues) => {
      const result = await updateSupplier(supplier.id, parseInt(orgId), data);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Supplier updated successfully");
      queryClient.invalidateQueries({ queryKey: ["org-suppliers", orgId] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update supplier", {
        description: error.message,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted">
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>Update supplier information</DialogDescription>
        </DialogHeader>
        <SupplierForm
          defaultValues={supplier}
          onSubmit={editSupplier}
          isSubmitting={isPending}
          submitLabel="Save Changes"
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
