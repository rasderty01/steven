"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EventSupplierWithDetails, SupplierStatus } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { SupplierStatusActions } from "./supplier-status-action";

interface EventSupplierCardProps {
  eventSupplier: EventSupplierWithDetails;
  onUpdate: (data: { id: number; status: SupplierStatus }) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  isUpdating: boolean;
}

export function EventSupplierCard({
  eventSupplier,
  onUpdate,
  onRemove,
  isUpdating,
}: EventSupplierCardProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{eventSupplier.supplier.name}</h3>
          <p className="text-sm">Service: {eventSupplier.service.name}</p>
          <p className="text-sm">Rate: ${eventSupplier.agreedRate}</p>
          <div className="mt-2">
            <SupplierStatusActions
              currentStatus={eventSupplier.status}
              supplierId={eventSupplier.id}
              onUpdateStatus={(status) =>
                onUpdate({
                  id: eventSupplier.id,
                  status,
                })
              }
              isUpdating={isUpdating}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              // Implement edit functionality later
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={() => onRemove(eventSupplier.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
