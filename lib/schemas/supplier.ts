// lib/validations/supplier.ts
import { type Database } from "@/utils/supabase/database.types";
import { z } from "zod";

export type SupplierCategory = Database["public"]["Enums"]["SupplierCategory"];

const supplierCategories: [SupplierCategory, ...SupplierCategory[]] = [
  "AV_Equipment",
  "Sound_System",
  "Lighting",
  "FoodCatering",
  "BeverageCatering",
  "Decoration",
  "Photography",
  "Videography",
  "Entertainment",
  "Security",
  "Transportation",
  "Other",
];

export const supplierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.enum(supplierCategories, {
    required_error: "Please select a category",
  }),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  description: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

export type Supplier = Database["public"]["Tables"]["Supplier"]["Row"];
export type SupplierService =
  Database["public"]["Tables"]["SupplierService"]["Row"];
export type EventSupplier =
  Database["public"]["Tables"]["EventSupplier"]["Row"];

// Enhanced types for joins and responses
export type SupplierWithServices = Supplier & {
  SupplierService: SupplierService[];
};

export type EventSupplierWithDetails = EventSupplier & {
  supplier: Supplier;
  service: SupplierService;
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