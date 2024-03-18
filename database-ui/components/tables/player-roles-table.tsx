"use client";

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
const DeleteAlertNoSSR = dynamic(() => import("@/components/delete-alert"), {
  ssr: false,
});

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DialogWithForm from "@/components/dialogs/edit-player-dialog";
import EditRoleDialog from "@/components/dialogs/edit-playerroles-dialog";

const PLAYERROLES_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/playerroles/`;

export type PlayerRole = {
  id: string;
  rank: string;
  role: string;
  mmr: number;
};

{
  /* Fill the table with data */
}
export const columns: ColumnDef<PlayerRole>[] = [
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

  // Add the ID number to the table. Sortable.
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="ml-4">{row.getValue("id")}</div>,
  },

  // Add the player role to the table. Sortable.
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="ml-4">{row.getValue("role")}</div>,
  },

  // Add the player rank to the table. Sortable.
  {
    accessorKey: "rank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="ml-4">{row.getValue("rank")}</div>,
    sortingFn: (rowA: Row<PlayerRole>, rowB: Row<PlayerRole>) => {
      const a = rowA.original;
      const b = rowB.original;
      return a.mmr - b.mmr;
    },
  },

  /* Create the action menu (...) */
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const role = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(`${role.role} ${role.rank}`)
              }
            >
              Copy Rank and Role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

{
  /* Generate the table */
}
interface DataTablePlayersProps {
  id: string;
  fetchPlayerInfo: () => Promise<void>;
}

export default function DataTablePlayers({
  id,
  fetchPlayerInfo,
}: DataTablePlayersProps) {
  const [data, setData] = useState<PlayerRole[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  /* Load and Update the table information */
  const fetchPlayers = useCallback(async () => {
    const response = await fetch(`${PLAYERROLES_API_URL}?id=${id}`);
    if (!response.ok) {
      setData([]);
      return;
      // Database API already LOGS this.
      //throw new Error(`HTTP error! status: ${response.status}. This error usually happens when a query returns nothing.`);
    }
    const result = await response.json();
    setData(result.playerRolesRows);
  }, [id]);

  useEffect(() => {
    fetchPlayers().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });
  }, [fetchPlayers]);

  /* Process Player Role Deletion */
  const handleContinue = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const totalRows = table.getRowModel().rows;

    // Prevent last role from being deleted.
    if (selectedRows.length >= totalRows.length) {
      toast({
        title: "Error",
        description:
          "You cannot delete all roles. At least one role must be left.",
      });
      return;
    }

    let deletedRoles = [];

    for (const row of selectedRows) {
      const response = await fetch(PLAYERROLES_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, role: row.original.role.toUpperCase() }),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "There was a problem deleting the roles.",
        });
        return;
      }
      deletedRoles.push("{ " + row.original.role.toUpperCase() + " } ");
    }

    toast({
      title: "Roles Deleted: ",
      description: deletedRoles,
    });

    // Refresh the table
    fetchPlayers().catch((e) => {
      console.error("An error occurred while refreshing the players data.", e);
    });

    // Refresh the data on the page
    fetchPlayerInfo().catch((e) => {
      console.error("An error occurred while refreshing the players data.", e);
    });

    // Make sure nothing is selected after deletion
    table.toggleAllRowsSelected(false);
  };

  /* Do nothing */
  const handleCancel = () => {}; // Wintah if he was a function

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full p-5">
      <div className="flex flex-4 items-center space-x-2">
        {/* Pass fetchPlayers so Edit Player Dialog can update table */}
        <DialogWithForm onClose={fetchPlayerInfo} id={id} />

        {/* Pass fetchPlayers so Edit Role Dialog can update table */}
        <EditRoleDialog
          onClose={() => [fetchPlayers(), fetchPlayerInfo()]}
          id={id}
          data={data}
        />
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter roles..."
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("role")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <DeleteAlertNoSSR
            onCancel={handleCancel}
            onContinue={handleContinue}
          >
            <Button
              size="sm"
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            >
              Delete
            </Button>
          </DeleteAlertNoSSR>
        </div>
      </div>
    </div>
  );
}
