// app/components/SendInvitationsDialog/GuestSelect.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Guest, SendInvitationsFormData } from "./types";

interface GuestSelectProps {
  form: UseFormReturn<SendInvitationsFormData>;
  guests: Guest[] | undefined;
  isLoadingGuests: boolean;
}

export function GuestSelect({
  form,
  guests,
  isLoadingGuests,
}: GuestSelectProps) {
  return (
    <FormField
      control={form.control}
      name="selectedGuests"
      render={() => (
        <FormItem>
          <FormLabel>Select Guests</FormLabel>
          <ScrollArea className="h-[200px] border rounded-md p-4">
            {isLoadingGuests ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading guests...
              </div>
            ) : !guests?.length ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No guests found
              </div>
            ) : (
              guests.map((guest) => (
                <FormField
                  key={guest.id}
                  control={form.control}
                  name="selectedGuests"
                  render={({ field }) => (
                    <FormItem
                      key={guest.id}
                      className="flex items-center space-x-3 space-y-0 py-2"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(guest.id)}
                          onCheckedChange={(checked) => {
                            const value = field.value || [];
                            if (checked) {
                              field.onChange([...value, guest.id]);
                            } else {
                              field.onChange(
                                value.filter((id) => id !== guest.id)
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <p>
                          {guest.firstName} {guest.lastName}
                          {guest.email && ` - ${guest.email}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Current Status:{" "}
                          {guest.RSVP?.attending || "Not responded"}
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              ))
            )}
          </ScrollArea>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
