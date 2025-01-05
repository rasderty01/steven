// app/[orgId]/events/[eventId]/guests/components/delete-guest-dialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Database } from "@/utils/supabase/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteGuest } from "../../actions";

type Guest = Database["public"]["Tables"]["Guest"]["Row"];

interface DeleteGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest;
  eventId: number;
}

export function DeleteGuestDialog({
  open,
  onOpenChange,
  guest,
  eventId,
}: DeleteGuestDialogProps) {
  const queryClient = useQueryClient();

  const { mutate: removeGuest, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return await deleteGuest({
        guestId: guest.id,
        eventId,
      });
    },
    onSuccess: () => {
      toast.success("Guest deleted successfully");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
    },
    onError: (error) => {
      toast.error("Failed to delete guest");
      console.error("Error deleting guest:", error);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove {guest.firstName} {guest.lastName} from the guest
            list. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeGuest()}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
