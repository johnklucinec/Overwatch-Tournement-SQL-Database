import Nav from "@/components/header-bar";
import Foot from "@/components/site-footer";

import DataTableRanks from "@/components/tables/ranks-table";
import DataTableRoles from "@/components/tables/roles-table";
import React from "react";

export default function Page() {
  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Ranks and Roles
            </h2>
            <p className="text-muted-foreground text-1xl">
              <span className="font-bold ">Ranks Table + Roles Table</span> -
              View all the available ranks and roles.
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              According to the database schema, only the current ranks and
              roles can be added.
            </p>
            <p className="text-muted-foreground">
              Ranks and Roles can only be added here.
            </p>
            <p className="text-muted-foreground">
              Existing ranks and roles cannot be deleted due to a 'CASCADE
              RESTRICT' constraint on the player-rank/role relationship.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Table Section */}

            {/* Ranks Section */}
            <div className="rounded-xl border bg-card text-card-foreground shadow col-span-4">
              <div className="flex flex-col pt-6 pl-6">
                <h2>Ranks</h2>
              </div>
              <div className="flex flex-col pl-6 pr-6">
                <DataTableRanks />
              </div>
            </div>

            {/* Roles Section */}
            <div className="rounded-xl border bg-card text-card-foreground shadow col-span-3">
              <div className="flex flex-col pt-6 pl-6">
                <h2>Roles</h2>
              </div>
              <div className="flex flex-col pl-6 pr-6">
                <DataTableRoles />
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
