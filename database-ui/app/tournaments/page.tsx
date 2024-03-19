<<<<<<< HEAD
<<<<<<< Updated upstream
import Nav from "@/components/header-bar"
import React from 'react';
=======
import Nav from "@/components/header-bar";
import Foot from "@/components/site-footer";

import React from "react";
>>>>>>> Stashed changes
=======
import Nav from "@/components/header-bar";
import Foot from "@/components/site-footer";

import React from "react";
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660

import DataTableTournament from "@/components/tables/tournaments-table";

export default function Page() {
  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
<<<<<<< HEAD
<<<<<<< Updated upstream
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"> 

        <div className="flex flex-col items-left justify-beginning space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Tournaments</h2>
          <p className="text-muted-foreground pl-1">Tournaments Table</p>
          <div className="rounded-md border"></div>
          <p className="text-muted-foreground">Here you can view and edit all the tournaments</p>
          <p className="text-muted-foreground">For detailed information about a specific tournament's teams (TournamentTeams), click on the action menu (the ...) of the desired tournament and select "View Team Details".</p>
        </div>

        {/* Top Banner */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">

            <div className="flex flex-1 items-center space-x-2">
            {/* Add Information Button */}
            <ImportSheet />
=======
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Tournaments</h2>
            <p className="text-muted-foreground text-1xl">
              <span className="font-bold ">
                Tournaments Table + TournamentTeams Table
              </span>{" "}
              - View and add all your Tournaments on this page.
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              Tournaments can have zero or more Teams (NULLable), and Teams can
              be in multiple Tournaments (M:M).
            </p>
            <p className="text-muted-foreground">
              Deleting a Tournament triggers a cascading delete, removing all
              associated TournamentTeams records.
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              To view and edit a Tournaments's details, click the action menu
              (...) next to their name and select 'View Tournament Details'.
            </p>
          </div>

          {/* Top Banner */}
          <div className="space-y-4">
            {/* Table Section */}
            <div className="rounded-md border bg-card text-card-foreground shadow">
              <div className="relative w-full overflow-auto bg-card text-card-foreground shadow">
                {/* Add Data Table*/}
                <DataTableTournament />
              </div>
>>>>>>> Stashed changes
=======
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Tournaments</h2>
            <p className="text-muted-foreground text-1xl">
              <span className="font-bold ">
                Tournaments Table + TournamentTeams Table
              </span>{" "}
              - View and add all your Tournaments on this page.
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              Tournaments can have zero or more Teams (NULLable), and Teams can
              be in multiple Tournaments (M:M).
            </p>
            <p className="text-muted-foreground">
              Deleting a Tournament triggers a cascading delete, removing all
              associated TournamentTeams records.
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              To view and edit a Tournaments's details, click the action menu
              (...) next to their name and select 'View Tournament Details'.
            </p>
          </div>

          {/* Top Banner */}
          <div className="space-y-4">
            {/* Table Section */}
            <div className="rounded-md border bg-card text-card-foreground shadow">
              <div className="relative w-full overflow-auto bg-card text-card-foreground shadow">
                {/* Add Data Table*/}
                <DataTableTournament />
              </div>
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
            </div>

            <div className="flex items-center justify-between px-2"></div>
          </div>
        </div>
      </div>
      <Foot />
    </main>
  );
}
