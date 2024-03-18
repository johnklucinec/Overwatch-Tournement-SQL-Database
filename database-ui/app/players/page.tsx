import Nav from "@/components/header-bar";
import Foot from "@/components/site-footer";
import React from "react";

import DataTableTeams from "@/components/tables/players-table";

export default function Page() {
  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Players</h2>
            <p className="text-muted-foreground text-1xl">
              <span className="font-bold ">
                Players Table + PlayerRoles Table
              </span>{" "}
              - View and add all your players on this page.
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              Players must have 1 to 3 roles assigned (NOT NULL).
            </p>
            <p className="text-muted-foreground">
              Removing a player's team assigned roles will remove them from the
              team (NOT NULL).
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              To view and edit player details, click the action menu (...) next
              to their name and select 'View Player Details'.
            </p>
          </div>

          {/* Top Banner */}
          <div className="space-y-4">
            {/* Table Section */}
            <div className="rounded-md border bg-card text-card-foreground shadow">
              <div className="relative w-full overflow-hidden">
                {/* Add Data Table*/}
                <DataTableTeams />
              </div>
            </div>

            <div className="flex items-center justify-between px-2"></div>
          </div>
        </div>
      </div>
      <Foot />
    </main>
  );
}
