import { z } from "zod";

// Zod schema for organization creation
export const createOrgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  clerkOrgID: z.string().optional(),
});

// Type for organization creation form
export type CreateOrgFormData = z.infer<typeof createOrgSchema>;

// Type based on database schema
export interface Organization {
  id: string;
  clerkOrgID: string;
  name: string;
  description: string | null;
  eventId: number | null;
  createdAt: string;
  updatedAt: string;
}
