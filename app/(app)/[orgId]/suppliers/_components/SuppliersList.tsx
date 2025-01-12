import { EmptyState } from "@/components/states/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  cn,
  formatCurrency,
  formatSupplierCategory,
  getCategoryBadgeColor,
} from "@/lib/utils";
import { Database } from "@/utils/supabase/database.types";
import {
  CheckCircle2,
  ChevronDown,
  Edit2,
  Mail,
  MoreVertical,
  Phone,
  Plus,
} from "lucide-react";
import React, { useState } from "react";
import { EditSupplier } from "./edit-supplier-action";
import { RemoveSupplier } from "./remove-supplier-action";
import { DeleteSupplierService } from "./remove-supplier-service-action";
import { VerifySupplier } from "./verify-supplier-action";
import { ViewSupplierDetails } from "./view-details-action";
import { Supplier } from "@/types";
import { EditSupplierService } from "./edit-supplier-service-action";
import { SupplierServiceForm } from "@/components/forms/add-supplier-service-form";

type SuppliersListProps = {
  suppliers?: Supplier[];
  showServices?: boolean;
};

export function SuppliersList({ suppliers, showServices }: SuppliersListProps) {
  const [expandedSupplier, setExpandedSupplier] = useState<number | null>(null);

  if (!suppliers?.length) {
    return (
      <EmptyState
        title="No suppliers found"
        description="There are no suppliers in this category yet."
      />
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Supplier</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <React.Fragment key={supplier.id}>
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {supplier.name}
                    {supplier.isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{supplier.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{supplier.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryBadgeColor(supplier.category)}>
                    {formatSupplierCategory(supplier.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {supplier.isVerified ? (
                    <Badge variant="default">Verified</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {showServices && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setExpandedSupplier(
                            expandedSupplier === supplier.id
                              ? null
                              : supplier.id
                          )
                        }
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            expandedSupplier === supplier.id &&
                              "transform rotate-180"
                          )}
                        />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ViewSupplierDetails supplier={supplier} />
                        <EditSupplier supplier={supplier} />
                        {!supplier.isVerified && (
                          <VerifySupplier supplierId={supplier.id} />
                        )}
                        <DropdownMenuSeparator />
                        <RemoveSupplier supplier={supplier}>
                          <button className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-muted">
                            Remove
                          </button>
                        </RemoveSupplier>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
              {showServices && (
                <TableRow
                  className={cn(
                    "hover:bg-transparent transition-all duration-200",
                    expandedSupplier !== supplier.id && "hidden"
                  )}
                >
                  <TableCell colSpan={5} className="p-0">
                    <div className="p-4 bg-muted/50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Offers and rates</h4>
                        <SupplierServiceForm supplierId={supplier.id}>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add a Service
                          </Button>
                        </SupplierServiceForm>
                      </div>
                      {supplier.services?.length ? (
                        <div className="border rounded-lg bg-background">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead>Service</TableHead>
                                <TableHead>Rate Type</TableHead>
                                <TableHead>Base Rate</TableHead>
                                <TableHead>Min Hours</TableHead>
                                <TableHead>Max Hours</TableHead>
                                <TableHead className="text-right">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {supplier.services.map((service) => (
                                <TableRow
                                  key={service.id}
                                  className="hover:bg-transparent"
                                >
                                  <TableCell>{service.name}</TableCell>
                                  <TableCell>
                                    {service.rateType.replace(/_/g, " ")}
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(service.baseRate)}
                                  </TableCell>
                                  <TableCell>
                                    {service.minimumHours ?? "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {service.maximumHours ?? "N/A"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <SupplierServiceForm
                                          service={service}
                                          supplierId={supplier.id}
                                        >
                                          <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted flex items-center gap-2">
                                            <Edit2 className="h-4 w-4" /> Edit
                                            Service
                                          </button>
                                        </SupplierServiceForm>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuSeparator />

                                        <DeleteSupplierService
                                          service={service}
                                        />
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No services added yet
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
