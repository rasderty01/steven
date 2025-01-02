// app/[orgId]/events/[eventId]/guests/components/edit-guest-dialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { type Database } from "@/utils/supabase/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const supabase = createClient();

const editGuestSchema = z.object({
  title: z
    .string()
    .optional()
    .transform((val) => val || null),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .transform((val) => val || null),
  phoneNumber: z
    .string()
    .optional()
    .transform((val) => val || null),
  role: z
    .string()
    .optional()
    .transform((val) => val || null),
});

type EditGuestSchema = z.infer<typeof editGuestSchema>;

type Guest = Database["public"]["Tables"]["Guest"]["Row"] & {
  RSVP: {
    attending: Database["public"]["Enums"]["RSVPStatus"] | null;
    dietaryPreferences: string | null;
    plusOne: boolean | null;
  } | null;
};

interface EditGuestDialogProps {
  guest: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGuestDialog({
  guest,
  open,
  onOpenChange,
}: EditGuestDialogProps) {
  const params = useParams();
  const queryClient = useQueryClient();

  const form = useForm<EditGuestSchema>({
    resolver: zodResolver(editGuestSchema),
    defaultValues: {
      title: guest.title || "",
      firstName: guest.firstName || "",
      lastName: guest.lastName,
      email: guest.email || "",
      phoneNumber: guest.phoneNumber || "",
      role: guest.role || "",
    },
  });

  const { mutate: updateGuest, isPending } = useMutation({
    mutationFn: async (values: EditGuestSchema) => {
      // Update guest
      const { error: guestError } = await supabase
        .from("Guest")
        .update({
          ...values,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", guest.id)
        .eq("eventId", params.eventId as string);

      if (guestError) throw guestError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast.success("Guest updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to update guest");
      console.error("Error updating guest:", error);
    },
  });

  function onSubmit(values: EditGuestSchema) {
    updateGuest(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Guest</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                      <SelectItem value="Prof">Prof</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field: { value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" value={value || ""} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field: { value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input value={value || ""} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field: { value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Family, Friend, Colleague"
                      value={value || ""}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
