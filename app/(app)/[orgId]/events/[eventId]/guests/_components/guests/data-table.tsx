"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CircleDot, Mail, Phone } from "lucide-react";
import * as React from "react";
import { DataTableToolbar } from "./bulk-action-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    autoResetPageIndex: false,
  });

  return (
    <div className="w-full space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        {/* Table view (hidden on small screens, visible on medium and up) */}
        <div className="hidden md:block overflow-y-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Card view (visible on small screens, hidden on medium and up) */}
        <div className="space-y-4 p-4 md:hidden">
          {table.getRowModel().rows.map((row) => {
            const firstName = row
              .getAllCells()
              .find((cell) => cell.column.id === "firstName")
              ?.getValue() as string;
            const lastName = row
              .getAllCells()
              .find((cell) => cell.column.id === "lastName")
              ?.getValue() as string;
            const email = row
              .getAllCells()
              .find((cell) => cell.column.id === "email")
              ?.getValue() as string;
            const phoneNumber = row
              .getAllCells()
              .find((cell) => cell.column.id === "phoneNumber")
              ?.getValue() as string;
            const role = row
              .getAllCells()
              .find((cell) => cell.column.id === "role")
              ?.getValue() as string;
            const rsvpAttendingCell = row
              .getAllCells()
              .find((cell) => cell.column.id === "rsvpAttending");
            const actionsCell = row
              .getAllCells()
              .find((cell) => cell.column.id === "actions");
            const selectCell = row
              .getAllCells()
              .find((cell) => cell.column.id === "select");

            return (
              <Card key={row.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {`${firstName?.charAt(0) || ""}${
                            lastName?.charAt(0) || ""
                          }`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {firstName} {lastName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {role || "No role specified"}
                        </p>
                      </div>
                    </div>
                    {selectCell && (
                      <div>
                        {flexRender(
                          selectCell.column.columnDef.cell,
                          selectCell.getContext()
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{email || "No email provided"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{phoneNumber || "No phone number provided"}</span>
                    </div>
                    {rsvpAttendingCell && (
                      <div className="flex items-center space-x-2 text-sm">
                        <CircleDot className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {flexRender(
                            rsvpAttendingCell.column.columnDef.cell,
                            rsvpAttendingCell.getContext()
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  {actionsCell && (
                    <div className="mt-4">
                      {flexRender(
                        actionsCell.column.columnDef.cell,
                        actionsCell.getContext()
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
