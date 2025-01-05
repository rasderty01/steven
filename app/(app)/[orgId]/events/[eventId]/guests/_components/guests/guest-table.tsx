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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { type Database } from "@/utils/supabase/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { EditGuestDialog } from "../edit-guest-dialog";

const supabase = createClient();

type Guest = Database["public"]["Tables"]["Guest"]["Row"] & {
  RSVP: {
    attending: Database["public"]["Enums"]["RSVPStatus"] | null;
    dietaryPreferences: string | null;
    plusOne: boolean | null;
  } | null;
};

interface GuestTableProps {
  guests?: Guest[];
}

const ITEMS_PER_PAGE = 10;

export default function GuestTable({ guests = [] }: GuestTableProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { hasEventPermission, isLoading: permissionsLoading } =
    usePermissions();
  const canManageGuests = hasEventPermission("MANAGE_GUESTS");

  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get("page")) || 1;

  // Filter guests based on search query
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        guest.firstName?.toLowerCase().includes(searchLower) ||
        guest.lastName.toLowerCase().includes(searchLower) ||
        guest.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [guests, searchQuery]);

  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGuests = filteredGuests.slice(startIndex, endIndex);

  const { mutate: deleteGuest, isPending: isDeleting } = useMutation({
    mutationFn: async (guestId: number) => {
      const { error: guestError } = await supabase
        .from("Guest")
        .update({
          is_deleted: true,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", guestId)
        .eq("eventId", params.eventId as string);

      if (guestError) throw guestError;

      const { error: rsvpError } = await supabase
        .from("RSVP")
        .update({
          is_deleted: true,
          updatedAt: new Date().toISOString(),
        })
        .eq("guestId", guestId)
        .eq("eventId", params.eventId as string);

      if (rsvpError) throw rsvpError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      toast.success("Guest deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedGuest(null);
    },
    onError: (error) => {
      toast.error("Failed to delete guest");
      console.error("Error deleting guest:", error);
    },
  });

  const getRSVPBadgeColor = (status: string | null) => {
    switch (status) {
      case "attending":
        return "bg-green-500";
      case "not attending":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  if (!guests) {
    return (
      <div className="text-center py-4 text-gray-500">No guests found.</div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="🔍 Search guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>RSVP Status</TableHead>
                <TableHead>Dietary Needs</TableHead>
                <TableHead>Plus One</TableHead>
                {canManageGuests && (
                  <TableHead className="w-[70px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentGuests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={canManageGuests ? 7 : 6}
                    className="text-center py-4 text-gray-500"
                  >
                    No guests found
                  </TableCell>
                </TableRow>
              ) : (
                currentGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      {guest.title ? `${guest.title} ` : ""}
                      {guest.firstName} {guest.lastName}
                    </TableCell>
                    <TableCell>{guest.email || "-"}</TableCell>
                    <TableCell>{guest.phoneNumber || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={getRSVPBadgeColor(
                          guest.RSVP?.attending ?? "pending"
                        )}
                      >
                        {guest.RSVP?.attending || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {guest.RSVP?.dietaryPreferences || "-"}
                    </TableCell>
                    <TableCell>{guest.RSVP?.plusOne ? "Yes" : "No"}</TableCell>
                    {canManageGuests && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-8 h-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedGuest(guest);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedGuest(guest);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      {selectedGuest && (
        <EditGuestDialog
          guest={selectedGuest}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedGuest(null);
          }}
        />
      )}
    </>
  );
}
