import Nav from "@/components/header-bar";
import React from "react";

import DataTableTeams from "@/components/tables/players-table";
import DialogWithForm from "@/components/cards-and-sheets/add-player-dialog";

export default function Page() {
  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Players</h2>
            <p className="text-muted-foreground pl-1">Player Table</p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              Here you can view and edit all the Players
            </p>
            <p className="text-muted-foreground">
              For detailed information about a specific players's roles
              (PlayerRoles), click on the action menu (the ...) of the desired
              tournament and select "View Player Details".
            </p>
          </div>

          {/* Top Banner */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex flex-4 items-center space-x-2">
                {/* Add Information Button */}
                <DialogWithForm />
              </div>
            </div>

            {/* Table Section */}
            <div className="rounded-md border">
              <div className="relative w-full overflow-hidden">
                {/* Add Data Table*/}
                <DataTableTeams />
              </div>
            </div>

            <div className="flex items-center justify-between px-2"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
