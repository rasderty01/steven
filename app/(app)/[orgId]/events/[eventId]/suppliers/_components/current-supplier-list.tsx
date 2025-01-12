"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventSupplierWithDetails, SupplierStatus } from "@/types";
import { EventSupplierCard } from "./even-supplier-card";

interface CurrentSuppliersListProps {
  eventSuppliers: EventSupplierWithDetails[];
  onUpdateSupplier: (data: {
    id: number;
    status: SupplierStatus;
  }) => Promise<void>;
  onRemoveSupplier: (id: number) => Promise<void>;
  isUpdating: boolean;
}

export function CurrentSuppliersList({
  eventSuppliers,
  onUpdateSupplier,
  onRemoveSupplier,
  isUpdating,
}: CurrentSuppliersListProps) {
  return (
    <Card className="h-[calc(100vh-200px)] overflow-y-auto">
      <CardHeader>
        <CardTitle>Current Event Suppliers</CardTitle>
        <CardDescription>Manage your event suppliers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {eventSuppliers.map((eventSupplier) => (
            <EventSupplierCard
              key={eventSupplier.id}
              eventSupplier={eventSupplier}
              onUpdate={onUpdateSupplier}
              onRemove={onRemoveSupplier}
              isUpdating={isUpdating}
            />
          ))}

          {!eventSuppliers.length && (
            <div className="text-center text-gray-500 py-8">
              No suppliers added to this event yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
