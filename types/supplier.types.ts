import { Database } from "@/utils/supabase/database.types";
import {
  QuerySupplierService,
  SupplierServiceRow,
} from "./supplier-service.types";
import { EventSupplier } from "./event-supplier.types";

//enums
export type SupplierCategory = Database["public"]["Enums"]["SupplierCategory"];
export type SupplierStatus = Database["public"]["Enums"]["SupplierStatus"];

//table rows
export type SupplierRow = Database["public"]["Tables"]["Supplier"]["Row"];

//table insert
export type SupplierInsert = Database["public"]["Tables"]["Supplier"]["Insert"];

//joined tables
export type Supplier = SupplierRow & {
  services?: QuerySupplierService[];
};

// Enhanced types for joins and responses
export type SupplierWithServices = Supplier & {
  SupplierService: SupplierServiceRow[];
};

export type EventSupplierWithDetails = EventSupplier & {
  supplier: SupplierRow;
  service: SupplierServiceRow;
};

// Mutation input types
export type AddSupplierInput = {
  supplierId: number;
  supplierServiceId: number;
  startTime: string;
  endTime: string;
  agreedRate: number;
  notes?: string;
  eventId: number;
};

export type UpdateSupplierInput = Partial<EventSupplier> & {
  id: number;
};

export type SupplierUpdate = Partial<
  Database["public"]["Tables"]["Supplier"]["Update"]
>;
