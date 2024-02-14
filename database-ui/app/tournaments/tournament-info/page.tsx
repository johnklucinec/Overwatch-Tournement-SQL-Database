"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import Nav from "@/components/header-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ImportSheet from "@/app/tournaments/tournament-info/sheet";
import DataTableTeams from "@/components/teams-table";

export default function Page() {

  const searchParams = useSearchParams();
  let name = searchParams.get('name') ?? 'Pachimari Tournament';

  // Get this data form the database
  const startDate = "2024-03-02"
  const endDate = "2024-06-31"
  const status = "Enrollment Open"
  name = name ?? 'Tournament' // Update this with tournament name if name is changed

  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"> 

        <div className="flex flex-col items-left justify-beginning space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
          <p className="text-muted-foreground">Here you can view and edit all the details about the {name}</p>

          <div className="rounded-md border"></div>
          <p className="text-muted-foreground">
            <strong>Status:</strong> {status}
          </p>
          <p className="text-muted-foreground">
            <strong>Start Date:</strong> {startDate}
          </p>
          <p className="text-muted-foreground">
            <strong>End Date:</strong> {endDate}
          </p>
        </div>

        {/* Top Banner */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">

            <div className="flex flex-1 items-center space-x-2">
            {/* Add Information Button */}
            <ImportSheet name={name} />
            </div>

          </div>

          {/* Table Section */}
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
            {/* Add Data Table*/}
            <DataTableTeams />
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
          </div>
        </div>
        </div>
      </div>
    </main>
  )
}