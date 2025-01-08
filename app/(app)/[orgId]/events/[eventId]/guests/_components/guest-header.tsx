"use client";

import { usePermissions } from "@/components/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { AddGuestDialog } from "./add-guest-dialog";
import { ImportGuestsDialog } from "./import-guests";
import { SendInvitationsDialog } from "./send-invitation-dialog";
import { TestEmailPreview } from "@/components/emails/test-emailcomponent";

export function GuestHeader() {
  const { hasEventPermission, isLoading: permissionsLoading } =
    usePermissions();

  const canAddGuests = hasEventPermission("MANAGE_GUESTS");
  const canSendInvites = hasEventPermission("SEND_INVITATIONS");

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4">
        {canAddGuests && (
          <>
            <AddGuestDialog />
            <ImportGuestsDialog />
          </>
        )}
      </div>

      {canSendInvites && <SendInvitationsDialog />}
    </div>
  );
}
