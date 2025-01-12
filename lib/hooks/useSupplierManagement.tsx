"use client";

import {
  addEventSupplier,
  removeEventSupplier,
  updateEventSupplier,
} from "@/app/(app)/[orgId]/events/[eventId]/suppliers/actions";
import { AddSupplierInput, UpdateSupplierInput } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSupplierManagement(eventId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Mutation: Add supplier to event
  const addSupplier = useMutation({
    mutationFn: (params: AddSupplierInput) => addEventSupplier(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-suppliers", eventId] });
      toast.success("Supplier added successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Failed to add supplier: ${error.message}`);
    },
  });

  // Mutation: Remove supplier from event
  const removeSupplier = useMutation({
    mutationFn: (eventSupplierId: number) =>
      removeEventSupplier(eventSupplierId, Number(eventId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-suppliers", eventId] });
      toast.success("Supplier removed successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove supplier: ${error.message}`);
    },
  });

  // Mutation: Update event supplier
  const updateSupplier = useMutation({
    mutationFn: (input: UpdateSupplierInput) =>
      updateEventSupplier(input, Number(eventId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-suppliers", eventId] });
      toast.success("Supplier updated successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update supplier: ${error.message}`);
    },
  });

  return {
    addSupplier,
    removeSupplier,
    updateSupplier,
  };
}
