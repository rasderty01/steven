"use client";

import {
  ServiceSelectionForm,
  ServiceSelectionFormData,
} from "@/components/forms/supplier-service-selection-form";
import { usePermissions } from "@/components/hooks/usePermissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSupplierManagement } from "@/lib/hooks/useSupplierManagement";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SupplierStatusActions } from "./_components/supplier-status-action";

export default function SplitViewSupplierManagement() {
  const { eventId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    suppliers,
    eventSuppliers,
    loadingSuppliers,
    loadingEventSuppliers,
    addSupplier,
    removeSupplier,
    updateSupplier,
  } = useSupplierManagement(eventId as string);

  // Check permissions
  const { hasEventPermission, isLoading: loadingPermissions } =
    usePermissions();
  const canManageSuppliers = hasEventPermission("MANAGE_LOGISTICS");

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers?.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSupplier = (data: ServiceSelectionFormData) => {
    if (!canManageSuppliers) {
      toast.error("You don't have permission to manage suppliers");
      return;
    }

    addSupplier.mutate({
      ...data,
      eventId: Number(eventId),
    });
  };

  if (loadingSuppliers || loadingEventSuppliers || loadingPermissions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Available Suppliers Panel */}
      <Card className="h-[calc(100vh-200px)] overflow-y-auto">
        <CardHeader>
          <CardTitle>Available Suppliers</CardTitle>
          <CardDescription>
            Select suppliers to add to your event
          </CardDescription>
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSuppliers?.map((supplier) => (
              <Card key={supplier.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{supplier.name}</h3>
                    <p className="text-sm text-gray-600">
                      {supplier.description}
                    </p>
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Event Suppliers Panel */}
      <Card className="h-[calc(100vh-200px)] overflow-y-auto">
        <CardHeader>
          <CardTitle>Current Event Suppliers</CardTitle>
          <CardDescription>Manage your event suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventSuppliers?.map((eventSupplier) => (
              <Card key={eventSupplier.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {eventSupplier.supplier.name}
                    </h3>
                    <p className="text-sm">
                      Service: {eventSupplier.service.name}
                    </p>
                    <p className="text-sm">Rate: ${eventSupplier.agreedRate}</p>
                    <div className="mt-2">
                      <SupplierStatusActions
                        currentStatus={eventSupplier.status}
                        supplierId={eventSupplier.id}
                        onUpdateStatus={(status) =>
                          updateSupplier.mutate({
                            id: eventSupplier.id,
                            status,
                          })
                        }
                        isUpdating={updateSupplier.isPending}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // Implement edit functionality
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeSupplier.mutate(eventSupplier.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {!eventSuppliers?.length && (
              <div className="text-center text-gray-500 py-8">
                No suppliers added to this event yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
