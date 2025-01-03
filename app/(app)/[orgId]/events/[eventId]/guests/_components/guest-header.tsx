"use client";

import { usePermissions } from "@/components/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { AddGuestDialog } from "./add-guest-dialog";
import { ImportGuestsDialog } from "./import-guests";

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

      {canSendInvites && (
        <Button
          variant="secondary"
          onClick={() => {
            /* Send invites modal - to be implemented */
          }}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Invitations
        </Button>
      )}
    </div>
  );
}
