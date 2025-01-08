// app/components/SendInvitationsDialog/ConfirmSection.tsx
"use client";

import { Guest, Template } from "./types";

interface ConfirmSectionProps {
  selectedTemplate: Template | undefined;
  selectedGuests: Guest[] | undefined;
  message?: string;
}

export function ConfirmSection({
  selectedTemplate,
  selectedGuests,
  message,
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
      <p className="text-sm text-muted-foreground">
        Please confirm that you want to proceed with sending these invitations.
      </p>
    </div>
  );
}
