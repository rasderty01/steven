// app/[orgId]/events/[eventId]/guests/components/guest-row-actions.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "@/utils/supabase/database.types";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { updateGuestRSVP } from "../../actions";
import { DeleteGuestDialog } from "./alert-dialog-delete";
import { EditGuestDialog } from "../edit-guest-dialog";
import { GuestWithRSVP } from "@/types/guest.types";
import { RSVPStatus } from "@/types";

interface DataTableRowActionsProps<TData extends GuestWithRSVP> {
  row: Row<TData>;
}

const rsvpStatuses: { label: string; value: RSVPStatus }[] = [
  { label: "Attending", value: "attending" },
  { label: "Not Attending", value: "not attending" },
  { label: "Pending", value: "pending" },
];

export function DataTableRowActions<TData extends GuestWithRSVP>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const eventId = row.original.eventId!;
  const currentStatus = row.original.RSVP?.attending;

  const { mutate: updateRSVP } = useMutation({
    mutationFn: async (status: RSVPStatus) => {
      return await updateGuestRSVP({
        guestId: row.original.id,
        eventId,
        rsvpStatus: status,
      });
    },
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["guests", eventId] });
      const previousGuests = queryClient.getQueryData(["guests", eventId]);

      queryClient.setQueryData(["guests", eventId], (old: any) => {
        const guests = Array.isArray(old) ? old : [];
        return guests.map((guest: GuestWithRSVP) =>
          guest.id === row.original.id
            ? {
                ...guest,
                RSVP: {
                  ...guest.RSVP,
                  attending: newStatus,
                },
              }
            : guest
        );
      });

      return { previousGuests };
    },
    onError: (err, newStatus, context) => {
      queryClient.setQueryData(["guests", eventId], context?.previousGuests);
      toast.error("Failed to update RSVP status");
      console.error("Error updating RSVP:", err);
    },
    onSuccess: () => {
      toast.success("RSVP status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
    },
  });

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsEditDialogOpen(true);
            }}
          >
            Edit Guest
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>RSVP Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={currentStatus || "pending"}>
                {rsvpStatuses.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                    onClick={() => updateRSVP(status.value)}
                  >
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onSelect={(e) => {
              e.preventDefault();
              setIsDeleteDialogOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteGuestDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        guest={row.original}
        eventId={eventId}
      />

      <EditGuestDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        guest={row.original}
      />
    </>
  );
}
