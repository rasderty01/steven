"use client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SupplierRow } from "@/types";

import React from "react";

// View Details Dialog
export function ViewSupplierDetails({ supplier }: { supplier: SupplierRow }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted">
          View Details
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{supplier.name}</DialogTitle>
          <DialogDescription>Supplier Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <div>
                {supplier.isVerified ? (
                  <Badge variant="default">Verified</Badge>
                ) : (
                  <Badge variant="secondary">Pending Verification</Badge>
                )}
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <div>{supplier.category.replace(/_/g, " ")}</div>
            </div>
            <div>
              <Label>Contact Person</Label>
              <div>{supplier.contactName}</div>
            </div>
            <div>
              <Label>Email</Label>
              <div>{supplier.email}</div>
            </div>
            <div>
              <Label>Phone</Label>
              <div>{supplier.phone}</div>
            </div>
            {supplier.address && (
              <div>
                <Label>Address</Label>
                <div>{supplier.address}</div>
              </div>
            )}
            {supplier.website && (
              <div>
                <Label>Website</Label>
                <div>{supplier.website}</div>
              </div>
            )}
            {supplier.description && (
              <div>
                <Label>Description</Label>
                <div>{supplier.description}</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
