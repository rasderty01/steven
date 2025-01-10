// app/components/SendInvitationsDialog/ConfirmSection.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Guest, SendInvitationsForm, Template } from "./types";

interface ConfirmSectionProps {
  selectedTemplate: Template | undefined;
  selectedGuests: Guest[] | undefined;
  message?: string;
  form: UseFormReturn<SendInvitationsForm>;
}

export function ConfirmSection({
  selectedTemplate,
  selectedGuests,
  message,
  form,
}: ConfirmSectionProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted p-4">
        <p className="font-semibold">You are about to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>
            Send invitation emails to {selectedGuests?.length || 0} guests
          </li>
          <li>Using the "{selectedTemplate?.name}" template</li>
          {message && <li>Including your personal message</li>}
        </ul>
      </div>

      <FormField
        control={form.control}
        name="consent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I confirm that I have permission to send emails to all selected
                guests and understand that by proceeding, invitation emails will
                be sent to their provided email addresses.
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      <p className="text-sm text-muted-foreground">
        Please confirm that you want to proceed with sending these invitations.
      </p>
    </div>
  );
}
