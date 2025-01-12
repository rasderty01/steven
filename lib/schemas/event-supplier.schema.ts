import { z } from "zod";

// Form validation schema
export const supplierServiceSchema = z.object({
  supplierServiceId: z.number({
    required_error: "Please select a service",
  }),
  startTime: z
    .string({
      required_error: "Please select a start time",
    })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z
    .string({
      required_error: "Please select an end time",
    })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  agreedRate: z
    .number({
      required_error: "Please enter the agreed rate",
    })
    .min(0, "Rate must be a positive number"),
  quantity: z
    .number({
      required_error: "Please enter the quantity",
    })
    .min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

// Type for form values
export type ServiceSelectionFormValues = z.infer<typeof supplierServiceSchema>;

// Type for submission data (matches database schema)
export type ServiceSelectionFormData = Omit<
  ServiceSelectionFormValues,
  "quantity"
> & {
  eventId: number;
  supplierId: number;
};
