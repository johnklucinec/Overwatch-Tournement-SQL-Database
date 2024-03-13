import Nav from "@/components/header-bar";
import React from "react";

import DataTableTournament from "@/components/tables/tournaments-table";

export default function Page() {
  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Tournaments</h2>
            <p className="text-muted-foreground pl-1">Tournaments Table</p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              Here you can view and edit all the tournaments
            </p>
            <p className="text-muted-foreground">
              For detailed information about a specific tournament's teams
              (TournamentTeams), click on the action menu (the ...) of the
              desired tournament and select "View Team Details".
            </p>
          </div>

          {/* Top Banner */}
          <div className="space-y-4">
            {/* Table Section */}
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                {/* Add Data Table*/}
                <DataTableTournament />
              </div>
            </div>

            <div className="flex items-center justify-between px-2"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
