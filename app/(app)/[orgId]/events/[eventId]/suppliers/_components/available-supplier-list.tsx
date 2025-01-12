"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SupplierWithServices } from "@/types";
import { ServiceSelectionFormData } from "@/lib/schemas/event-supplier.schema";
import { SupplierCard } from "./supplier-card";

interface AvailableSuppliersListProps {
  suppliers: SupplierWithServices[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddSupplier: (data: ServiceSelectionFormData) => Promise<void>;
  canManageSuppliers: boolean;
}

export function AvailableSuppliersList({
  suppliers,
  searchQuery,
  onSearchChange,
  onAddSupplier,
  canManageSuppliers,
}: AvailableSuppliersListProps) {
  return (
    <Card className="h-[calc(100vh-200px)] overflow-y-auto">
      <CardHeader>
        <CardTitle>Available Suppliers</CardTitle>
        <CardDescription>Select suppliers to add to your event</CardDescription>
        <Input
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onAdd={onAddSupplier}
              canManageSuppliers={canManageSuppliers}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
