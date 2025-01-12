"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ServiceSelectionForm } from "@/components/forms/supplier-service-selection-form";
import { ServiceSelectionFormData } from "@/lib/schemas/event-supplier.schema";
import { Supplier, SupplierWithServices } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface SupplierCardProps {
  supplier: SupplierWithServices;
  onAdd: (data: ServiceSelectionFormData) => Promise<void>;
  canManageSuppliers: boolean;
}

export function SupplierCard({
  supplier,
  onAdd,
  canManageSuppliers,
}: SupplierCardProps) {
  const handleAddSupplier = async (data: ServiceSelectionFormData) => {
    if (!canManageSuppliers) {
      toast.error("You don't have permission to manage suppliers");
      return;
    }
    await onAdd(data);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{supplier.name}</h3>
          <p className="text-sm text-gray-600">{supplier.description}</p>
          <Badge variant="secondary" className="mt-2">
            {supplier.category.replace(/_/g, " ")}
          </Badge>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add {supplier.name} to Event</DialogTitle>
              <DialogDescription>
                Select a service and configure details
              </DialogDescription>
            </DialogHeader>
            <ServiceSelectionForm
              supplier={supplier}
              onSubmit={handleAddSupplier}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
