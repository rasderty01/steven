import { Database } from "@/utils/supabase/database.types";

export type RateType = Database["public"]["Enums"]["RateType"];

export type SupplierServiceRow =
  Database["public"]["Tables"]["SupplierService"]["Row"];

export type QuerySupplierService = Pick<
  SupplierServiceRow,
  "id" | "name" | "baseRate" | "rateType" | "description"
>;

// Table insert
export type SupplierServiceInsert =
  Database["public"]["Tables"]["SupplierService"]["Insert"];

export type SupplierServicePick = Pick<
  Database["public"]["Tables"]["SupplierService"]["Row"],
  "id" | "name"
>;
