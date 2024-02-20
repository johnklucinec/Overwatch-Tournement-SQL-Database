import Nav from "@/components/header-bar"

import DataTableTeams from "@/components/tables/teams-table"
import CardWithForm from "@/components/cards-and-sheets/add-team-card"
import React from 'react';

export default function Page() {
  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"> 

        <div className="flex flex-col items-left justify-beginning space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Teams</h2>
          <p className="text-muted-foreground pl-1">Teams Table</p>
          <div className="rounded-md border"></div>
          <p className="text-muted-foreground">Here you can view and edit all the teams</p>
          <p className="text-muted-foreground">For detailed information about a specific team's players (TeamPlayers), click on the action menu (the ...) of the desired team and select "View Team Details".</p>
        </div>

        {/* Top Banner */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">

            <div className="flex flex-1 items-center space-x-2">
            {/* Add Information Button */}
            <CardWithForm />
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