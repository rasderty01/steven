import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AddSupplierInput,
  EventSupplierWithDetails,
  SupplierWithServices,
  UpdateSupplierInput,
} from "../schemas/supplier";

const supabase = createClient();

export function useSupplierManagement(eventId: string) {
  const queryClient = useQueryClient();

  // Query: Get all suppliers with their services
  const { data: suppliers, isLoading: loadingSuppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async (): Promise<SupplierWithServices[]> => {
      const { data, error } = await supabase
        .from("Supplier")
        .select("*, SupplierService(*)");

      if (error) throw error;
      return data;
    },
  });

  // Query: Get event suppliers with details
  const { data: eventSuppliers, isLoading: loadingEventSuppliers } = useQuery({
    queryKey: ["event-suppliers", eventId],
    queryFn: async (): Promise<EventSupplierWithDetails[]> => {
      const { data, error } = await supabase
        .from("EventSupplier")
        .select(
          `
          *,
          supplier:Supplier(*),
          service:SupplierService(*)
        `
        )
        .eq("eventId", Number(eventId));

      if (error) throw error;
      return data;
    },
  });

  // Mutation: Add supplier to event
  const addSupplier = useMutation({
    mutationFn: async (params: AddSupplierInput) => {
      const { data, error } = await supabase
        .from("EventSupplier")
        .insert(params)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-suppliers", eventId] });
      toast.success("Supplier added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add supplier: ${error.message}`);
    },
  });

  // Mutation: Remove supplier from event
  const removeSupplier = useMutation({
    mutationFn: async (eventSupplierId: number) => {
      const { error } = await supabase
        .from("EventSupplier")
        .delete()
        .eq("id", eventSupplierId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-suppliers", eventId] });
      toast.success("Supplier removed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove supplier: ${error.message}`);
    },
  });

  // Mutation: Update event supplier
  const updateSupplier = useMutation({
    mutationFn: async ({ id, ...params }: UpdateSupplierInput) => {
      const { error } = await supabase
        .from("EventSupplier")
        .update(params)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-suppliers", eventId] });
      toast.success("Supplier updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update supplier: ${error.message}`);
    },
  });

  return {
    // Queries
    suppliers,
    eventSuppliers,
    loadingSuppliers,
    loadingEventSuppliers,

    // Mutations
    addSupplier,
    removeSupplier,
    updateSupplier,
  };
}
