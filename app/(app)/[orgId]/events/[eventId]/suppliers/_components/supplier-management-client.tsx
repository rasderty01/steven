"use client";

import {
  SupplierWithServices,
  EventSupplierWithDetails,
  SupplierStatus,
} from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/components/hooks/usePermissions";
import { useSupplierManagement } from "@/lib/hooks/useSupplierManagement";
import { AvailableSuppliersList } from "./available-supplier-list";
import { CurrentSuppliersList } from "./current-supplier-list";
import { ServiceSelectionFormData } from "@/lib/schemas/event-supplier.schema";

interface SupplierManagementClientProps {
  suppliers: SupplierWithServices[];
  eventSuppliers: EventSupplierWithDetails[];
  eventId: string;
}

export function SupplierManagementClient({
  suppliers: initialSuppliers,
  eventSuppliers: initialEventSuppliers,
  eventId,
}: SupplierManagementClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [eventSuppliers, setEventSuppliers] = useState(initialEventSuppliers);

  const { hasEventPermission } = usePermissions();
  const canManageSuppliers = hasEventPermission("MANAGE_LOGISTICS");

  const { addSupplier, removeSupplier, updateSupplier } =
    useSupplierManagement(eventId);

  // Handler for adding a supplier
  const handleAddSupplier = async (data: ServiceSelectionFormData) => {
    try {
      await addSupplier.mutateAsync({
        ...data,
        eventId: Number(eventId),
      });
      router.refresh();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handler for updating a supplier's status
  const handleUpdateSupplier = async (data: {
    id: number;
    status: SupplierStatus;
  }) => {
    setEventSuppliers((prev) =>
      prev.map((s) => (s.id === data.id ? { ...s, status: data.status } : s))
    );

    try {
      await updateSupplier.mutateAsync(data);
      router.refresh();
    } catch {
      // Revert on error
      setEventSuppliers(initialEventSuppliers);
    }
  };

  // Handler for removing a supplier
  const handleRemoveSupplier = async (id: number) => {
    setEventSuppliers((prev) => prev.filter((s) => s.id !== id));

    try {
      await removeSupplier.mutateAsync(id);
      router.refresh();
    } catch {
      // Revert on error
      setEventSuppliers(initialEventSuppliers);
    }
  };

  // Filter suppliers based on search query
  const filteredSuppliers = initialSuppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AvailableSuppliersList
        suppliers={filteredSuppliers}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        canManageSuppliers={canManageSuppliers}
        onAddSupplier={handleAddSupplier}
      />
      <CurrentSuppliersList
        eventSuppliers={eventSuppliers}
        onUpdateSupplier={handleUpdateSupplier}
        onRemoveSupplier={handleRemoveSupplier}
        isUpdating={updateSupplier.isPending}
      />
    </div>
  );
}
