"use client";

import React, { useEffect, useState, useCallback } from "react";

import { useRouter } from "next/navigation";
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
  DropdownMenuSeparator,
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

/* Dialog with Button to add a new player */
import DialogWithForm from "@/components/cards-and-sheets/add-team-dialog";

/* API Route to populate the players table */
const TEAMS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/`;

export type Team = {
  id: string;
  players: number;
  averageRank: string;
  mmr: number;
  name: string;
  formationDate: string;
};

{
  /* We need to sort the data with the mmr */
}

{
  /* Fill the table with data */
}
export const columns: ColumnDef<Team>[] = [
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

  // Add the team names to the table. Sortable.
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="ml-4">{row.getValue("name")}</div>,
  },

  // Add the teams average rank to the table. Sortable.
  // Sorts behind the scenes with the players MMR
  {
    accessorKey: "averageRank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Average Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4">{row.getValue("averageRank")}</div>
    ),
    sortingFn: (rowA: Row<Team>, rowB: Row<Team>) => {
      const a = rowA.original;
      const b = rowB.original;
      return a.mmr - b.mmr;
    },
  },

  // Add the teams formation date to the table. Sortable.
  {
    accessorKey: "formationDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Formation Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4">{row.getValue("formationDate")}</div>
    ),
  },

  // Add the players created at date to the table. Sortable.
  {
    accessorKey: "players",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Players
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { players } = row.original;
      return <div className="ml-4">{players}</div>;
    },
  },

  /* All the Actions */
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const team = row.original;
      const router = useRouter();

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
              onClick={() => navigator.clipboard.writeText(team.name)}
            >
              Copy Team Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  `/teams/players-info?id=${team.id}&name=${encodeURIComponent(
                    team.name
                  )}`
                );
              }}
            >
              View team details
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
export default function DataTableTeams() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Team[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    {}
  );

  /* Load and Update the table information */
  const fetchTeams = useCallback(async () => {
    const response = await fetch(TEAMS_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    setData(result.playersRows);
  }, []);

  useEffect(() => {
    fetchTeams().catch((e) => {
      console.error("An error occurred while fetching the teams data.", e);
    });
  }, [fetchTeams]);

  /* Process Team Deletion */
  const handleContinue = async () => {
    toast({
      title: "Error",
      description: "This Function is not ready yet",
    });

    return;
    /*
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    //const getDeletePlayerUrl = (id: string) => `${TEAMS_API_URL}?id=${id}`;
    let deletedTeams = [];

    for (const row of selectedRows) {
      const response = await fetch(TEAMS_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, role: row.original.role.toUpperCase() }),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "There was a problem deleting the teams.",
        });
        return
      }
      deletedTeams.push("{ " + row.original.name + " } ")
    }

    toast({
      title: "Teams Deleted: ",
      description: deletedRoles,
    });

    // Refresh the table
    fetchPlayers().catch((e) => {
      console.error("An error occurred while refreshing the players data.", e);
    });

        // Make sure nothing is selected after deletion
    table.toggleAllRowsSelected(false);
    */
  };

  /* Do nothing */
  const handleCancel = () => {};

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
        {/* Pass fetchTeams so Dialog can update table */}
        <DialogWithForm onClose={fetchTeams} />
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter teams..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
