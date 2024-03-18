"use client";

import React, { useCallback, useEffect, useState } from "react";

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

import EditTeamDialog from "@/components/dialogs/edit-team-dialog";
import EditTeamPlayersDialog from "@/components/dialogs/edit-teamplayers-dialog";
import AddTeamPlayersDialog from "@/components/dialogs/add-teamplayers-dialog";

/* API Route to populate the players table */
const TEAMPLAYERS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teamplayers/`;

export type Players = {
  id: string;
  roles: string;
  highestRank: string;
  mmr: number;
  email: string;
  createdAt: string;
  name: string;
};

export type Player = {
  id: string;
  name: string;
  roles: string[];
};

function convertPlayersToPlayer(players: Players[]): Player[] {
  const convertedPlayers = players.map((player) => ({
    id: player.id,
    name: player.name,
    roles: player.roles.split(","),
  }));

  return convertedPlayers;
}

{
  /* Fill the table with data */
}
export const columns: ColumnDef<Players>[] = [
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

  // Add the players name to the table. Sortable.
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
    cell: ({ row }) => {
      const { name } = row.original;
      return <div className="ml-4">{name}</div>;
    },
  },

  // Add the players highest rank to the table. Sortable.
  // Sorts behind the scenes with the players MMR
  {
    accessorKey: "highestRank",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Highest Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="ml-4">{row.getValue("highestRank")}</div>
    ),
    sortingFn: (rowA: Row<Players>, rowB: Row<Players>) => {
      const a = rowA.original;
      const b = rowB.original;
      return a.mmr - b.mmr;
    },
  },

  // Add the players email to the table. Sortable.
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { email } = row.original;
      return <div className="ml-4">{email}</div>;
    },
  },

  // Add the players created at date to the table. Sortable.
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return <div className="ml-4">{createdAt}</div>;
    },
  },

  // Add the players roles to the table. Sortable.
  {
    accessorKey: "roles",
    header: () => <Button variant="ghost">Roles</Button>,
    cell: ({ row }) => {
      const { roles } = row.original;
      return <div className="ml-4">{roles}</div>;
    },
  },

  /* Create the action menu (...) */
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const player = row.original;
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
              onClick={() => {
                try {
                  navigator.clipboard.writeText(
                    `ID: ${player.id}\nName: ${player.name}\nHighest Role: ${player.highestRank}\nMMR: ${player.mmr}\nEmail: ${player.email}\nCreated At: ${player.createdAt}\nRoles: ${player.roles}`
                  );
                } catch (error) {
                  console.error("Error copying player details:", error);
                }
              }}
            >
              Copy Player Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  `/players/player-info?id=${
                    player.id
                  }&name=${encodeURIComponent(player.name)}`
                );
              }}
            >
              View player details
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
  fetchTeamPlayerInfo: () => Promise<void>;
}

// eslint-disable-next-line no-unused-vars
export default function DataTablePlayers({
  id,
  fetchTeamPlayerInfo,
}: DataTablePlayersProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Players[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    {}
  );

  /* Load and Update the table information */
  const fetchPlayers = useCallback(async () => {
    const response = await fetch(`${TEAMPLAYERS_API_URL}?id=${id}`);
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
      console.error(
        "An error occurred while fetching the teamplayers data.",
        e
      );
    });
  }, [fetchPlayers]);

  /* Process Players Deletion */
  const handleContinue = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const teamID = id;
    let deletedRoles = [];

    for (const row of selectedRows) {
      let playerID = row.original.id;

      const response = await fetch(TEAMPLAYERS_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamID: teamID.toString(),
          playerID: playerID.toString(),
        }),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "There was a problem deleting the roles.",
        });
        return;
      }
      deletedRoles.push("{ " + row.original.name + " } ");
    }

    toast({
      title: "Player(s) Removed: ",
      description: deletedRoles,
    });

    // Refresh the table
    fetchPlayers().catch((e) => {
      console.error("An error occurred while refreshing the players data.", e);
    });

    // Refresh the data on the page
    fetchTeamPlayerInfo().catch((e) => {
      console.error("An error occurred while refreshing the players data.", e);
    });

    // Make sure nothing is selected after deletion
    table.toggleAllRowsSelected(false);
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
        {/* Pass fetchPlayers so Dialog can update table */}
        {/* <DialogWithForm onClose={fetchPlayers}/> */}
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            {/* Add Information Button */}
            <EditTeamDialog onClose={fetchTeamPlayerInfo} id={id} />

            <div>
              <p>|</p>
            </div>

            {/* Edit Information Button */}
            <AddTeamPlayersDialog
              onClose={fetchTeamPlayerInfo}
              id={id}
              refreshTable={fetchPlayers}
            />

            {/* Edit Information Button */}

            {/* Edit Information Button */}
            <EditTeamPlayersDialog
              onClose={fetchTeamPlayerInfo}
              refreshTable={fetchPlayers}
              id={id}
              data={convertPlayersToPlayer(data)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter players..."
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
              Remove
            </Button>
          </DeleteAlertNoSSR>
        </div>
      </div>
    </div>
  );
}
