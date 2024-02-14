"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

{/* Add the sample data */}
const data: Rank[] = [
  {
    id: "1",
    rankName: "Bronze",
    division: 5,
    mmr: 1000,
  },
  {
    id: "2",
    rankName: "Bronze",
    division: 4,
    mmr: 1100,
  },
  {
    id: "3",
    rankName: "Bronze",
    division: 3,
    mmr: 1200,
  },
  {
    id: "4",
    rankName: "Bronze",
    division: 2,
    mmr: 1300,
  },
  {
    id: "5",
    rankName: "Bronze",
    division: 1,
    mmr: 1400,
  },
  {
    id: "6",
    rankName: "Silver",
    division: 5,
    mmr: 1500,
  },
  {
    id: "7",
    rankName: "Silver",
    division: 4,
    mmr: 1600,
  },
  {
    id: "8",
    rankName: "Silver",
    division: 3,
    mmr: 1700,
  },
  {
    id: "9",
    rankName: "Silver",
    division: 2,
    mmr: 1800,
  },
  {
    id: "10",
    rankName: "Silver",
    division: 1,
    mmr: 1900,
  },
  {
    id: "11",
    rankName: "Gold",
    division: 5,
    mmr: 2000,
  },
  {
    id: "12",
    rankName: "Gold",
    division: 4,
    mmr: 2100,
  },
  {
    id: "13",
    rankName: "Gold",
    division: 3,
    mmr: 2200,
  },
  {
    id: "14",
    rankName: "Gold",
    division: 2,
    mmr: 2300,
  },
  {
    id: "15",
    rankName: "Gold",
    division: 1,
    mmr: 2400,
  },
  {
    id: "16",
    rankName: "Platnium",
    division: 5,
    mmr: 2500,
  },
  {
    id: "17",
    rankName: "Platnium",
    division: 4,
    mmr: 2600,
  },
  {
    id: "18",
    rankName: "Platnium",
    division: 3,
    mmr: 2700,
  },
  {
    id: "19",
    rankName: "Platnium",
    division: 2,
    mmr: 2800,
  },
  {
    id: "20",
    rankName: "Platnium",
    division: 1,
    mmr: 2900,
  },
  {
    id: "21",
    rankName: "Diamond",
    division:  5,
    mmr:  3000,
  },
  {
    id: "22",
    rankName: "Diamond",
    division:  4,
    mmr:  3100,
  },
  {
    id: "23",
    rankName: "Diamond",
    division:  3,
    mmr:  3200,
  },
  {
    id: "24",
    rankName: "Diamond",
    division:  2,
    mmr:  3300,
  },
  {
    id: "25",
    rankName: "Diamond",
    division:  1,
    mmr:  3400,
  },
  {
    id: "26",
    rankName: "Master",
    division:  5,
    mmr:  3500,
  },
  {
    id: "27",
    rankName: "Master",
    division:  4,
    mmr:  3600,
  },
  {
    id: "28",
    rankName: "Master",
    division:  3,
    mmr:  3700,
  },
  {
    id: "29",
    rankName: "Master",
    division:  2,
    mmr:  3800,
  },
  {
    id: "30",
    rankName: "Master",
    division:  1,
    mmr:  3900,
  },
  {
    id: "31",
    rankName: "Grandmaster",
    division:  5,
    mmr:  4000,
  },
  {
    id: "32",
    rankName: "Grandmaster",
    division:  4,
    mmr:  4100,
  },
  {
    id: "33",
    rankName: "Grandmaster",
    division:  3,
    mmr:  4200,
  },
  {
    id: "34",
    rankName: "Grandmaster",
    division:  2,
    mmr:  4300,
  },
  {
    id: "35",
    rankName: "Grandmaster",
    division:  1,
    mmr:  4400,
  },
  {
    id: "36",
    rankName: "Champion",
    division:  5,
    mmr:  4500,
  },
  {
    id: "37",
    rankName: "Champion",
    division:  4,
    mmr:  4600,
  },
  {
    id: "38",
    rankName: "Champion",
    division:  3,
    mmr:  4700,
  },
  {
    id: "39",
    rankName: "Champion",
    division:  2,
    mmr:  4800,
  },
  {
    id: "40",
    rankName: "Champion",
    division:  1,
    mmr:  4900,
  },
]

export type Rank = {
  id: string;
  rankName: string;
  division: number;
  mmr: number;
};

{/* We need to sort the data with the mmr */}

{/* Fill the table with data */}
export const columns: ColumnDef<Rank>[] = [


  {
    accessorKey: "rankName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rank Name
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("rankName")}</div>,
  },

  {
    accessorKey: "division",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Division
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("division")}</div>,
  },

  { /* All the Actions */
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const rank = row.original

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
              onClick={() => navigator.clipboard.writeText(`${rank.rankName} ${rank.division}`)}
            >
              Copy Rank Name and Division
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

{/* Generate the table */}
export default function DataTableRanks() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full p-5">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter ranks..."
          value={(table.getColumn("rankName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("rankName")?.setFilterValue(event.target.value)
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
                )
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
                  )
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
        </div>
      </div>
    </div>
  )
}
