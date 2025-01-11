// app/[orgId]/events/[eventId]/guests/components/data-table-toolbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Cross2Icon,
  TrashIcon,
  CheckIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

import { DataTableViewOptions } from "./data-table-view-options";
import { Database } from "@/utils/supabase/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteGuest, updateGuestRSVP } from "../../actions";
import { DataTableFacetedFilter } from "./data-table-facetedfilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RSVPStatus } from "@/types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export const statuses = [
  {
    value: "attending",
    label: "Attending",
    icon: CheckIcon,
  },
  {
    value: "not attending",
    label: "Not Attending",
    icon: Cross1Icon,
  },
  {
    value: "pending",
    label: "Pending",
    icon: Cross2Icon,
  },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const queryClient = useQueryClient();
  const isFiltered = table.getState().columnFilters.length > 0;

  // Get all selected rows
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedGuests = selectedRows.map((row) => ({
    id: (row.original as any).id,
    eventId: (row.original as any).eventId,
    firstName: (row.original as any).firstName,
    lastName: (row.original as any).lastName,
    RSVP: (row.original as any).RSVP,
  }));

  const { mutate: updateBulkRSVP } = useMutation({
    mutationFn: async (status: RSVPStatus) => {
      const promises = selectedGuests.map((guest) =>
        updateGuestRSVP({
          guestId: guest.id,
          eventId: guest.eventId,
          rsvpStatus: status,
        })
      );
      await Promise.all(promises);
    },
    onMutate: async (newStatus) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["guests"] });

      // Snapshot the previous value
      const previousGuests = queryClient.getQueryData<any[]>(["guests"]);

      // Optimistically update to the new value
      queryClient.setQueryData<any[]>(["guests"], (old = []) => {
        return old.map((guest) => {
          if (selectedGuests.some((selected) => selected.id === guest.id)) {
            return {
              ...guest,
              RSVP: {
                ...guest.RSVP,
                attending: newStatus,
              },
            };
          }
          return guest;
        });
      });

      // Return context for rollback
      return { previousGuests };
    },
    onSuccess: () => {
      toast.success("Successfully updated selected guests");
      table.toggleAllRowsSelected(false);
    },
    onError: (error, _, context) => {
      // Rollback to the previous value
      queryClient.setQueryData(["guests"], context?.previousGuests);
      toast.error("Failed to update guests");
      console.error("Error updating guests:", error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });

  const { mutate: deleteBulkGuests, isPending: pendingDeleteBulkGuests } =
    useMutation({
      mutationFn: async () => {
        const promises = selectedGuests.map((guest) =>
          deleteGuest({
            guestId: guest.id,
            eventId: guest.eventId,
          })
        );
        await Promise.all(promises);
      },
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["guests"] });

        const previousGuests = queryClient.getQueryData<any[]>(["guests"]);

        // Optimistically remove the deleted guests
        queryClient.setQueryData<any[]>(["guests"], (old = []) => {
          return old.filter(
            (guest) =>
              !selectedGuests.some((selected) => selected.id === guest.id)
          );
        });

        return { previousGuests };
      },
      onSuccess: () => {
        toast.success("Successfully deleted selected guests");
        table.toggleAllRowsSelected(false);
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(["guests"], context?.previousGuests);
        toast.error("Failed to delete guests");
        console.error("Error deleting guests:", error);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["guests"] });
      },
    });

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {selectedRows.length > 0 ? (
          <>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                {selectedRows.length} selected
              </p>
              <Select
                onValueChange={(value: RSVPStatus) => updateBulkRSVP(value)}
                disabled={pendingDeleteBulkGuests}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update RSVP Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attending">
                    <span className="flex items-center">Mark Attending</span>
                  </SelectItem>
                  <SelectItem value="not attending">
                    <span className="flex items-center">
                      Mark Not Attending
                    </span>
                  </SelectItem>
                  <SelectItem value="pending">
                    <span className="flex items-center">Mark Pending</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => deleteBulkGuests()}
                disabled={pendingDeleteBulkGuests}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </>
        ) : (
          <>
            <Input
              placeholder="Filter First Name..."
              value={
                (table.getColumn("firstName")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("firstName")?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[200px]"
            />
            <Input
              placeholder="Filter Last Name..."
              value={
                (table.getColumn("lastName")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("lastName")?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[200px]"
            />
            {table.getColumn("rsvpAttending") && (
              <DataTableFacetedFilter
                column={table.getColumn("rsvpAttending")}
                title="Status"
                options={statuses}
              />
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
