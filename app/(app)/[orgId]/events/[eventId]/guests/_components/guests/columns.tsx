"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "@/utils/supabase/database.types";
import { Checkbox } from "@/components/ui/checkbox";
import { GuestWithRSVP } from "@/types/guest";

export const columns: ColumnDef<GuestWithRSVP>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "rsvpAttending",
    accessorFn: (row) => row.RSVP?.attending || "pending", // Default to pending if no RSVP
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("rsvpAttending");

      return (
        <Badge
          variant={
            value === "attending"
              ? "default"
              : value === "not attending"
                ? "destructive"
                : "secondary"
          }
        >
          {value === "attending"
            ? "Attending"
            : value === "not attending"
              ? "Not Attending"
              : "Pending"}
        </Badge>
      );
    },
    filterFn: (row, id, value: string[]) => {
      // Handle case where value is undefined or not an array
      if (!Array.isArray(value)) return true;
      const status = row.getValue(id) as string;
      return value.includes(status);
    },
    enableColumnFilter: true,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
