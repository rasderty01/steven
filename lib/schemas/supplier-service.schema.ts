import { z } from "zod";

// Form Schema
export const supplierServiceForm = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  baseRate: z.number().min(0, "Base rate must be a positive number"),
  rateType: z.enum([
    "Hourly",
    "Daily",
    "Fixed",
    "PerPerson",
    "Custom",
  ] as const),
  minimumHours: z.number().min(0).nullable(),
  maximumHours: z.number().min(0).nullable(),
});

export type SupplierServiceValues = z.infer<typeof supplierServiceForm>;
