"use client";

import { usePermissions } from "@/components/hooks/usePermissions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteEvent } from "@/app/(app)/[orgId]/events/[eventId]/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EventActionsProps {
  eventId: string;
  orgId: string;
}

export function EventActions({ eventId, orgId }: EventActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasEventPermission } = usePermissions();

  const canEdit = hasEventPermission("EDIT");
  const canDelete = hasEventPermission("DELETE");

  const deleteEventMutation = useMutation({
    mutationFn: async () => {
      await deleteEvent(eventId);
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      router.refresh();
      router.push(`/${orgId}/events`);
      setIsDeleteOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete event");
      console.error("Error deleting event:", error);
    },
  });

  if (!canEdit && !canDelete) return null;

  return (
    <div className="flex items-center gap-2">
      {canEdit && (
        <Link href={`/${orgId}/events/${eventId}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Event
          </Button>
        </Link>
      )}

      {canDelete && (
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteEventMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete the event. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteEventMutation.mutate()}
                disabled={deleteEventMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteEventMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
