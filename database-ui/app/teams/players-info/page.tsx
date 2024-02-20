/* eslint-disable no-unused-vars, no-redeclare */
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Nav from "@/components/header-bar";
import React from "react";

import CardWithForm from "@/components/cards-and-sheets/add-teamplayer-card";
import PlayerCardWithForm from "@/components/cards-and-sheets/edit-teamplayer-card";
import CardWithFormEditTeam from "@/components/cards-and-sheets/edit-team-card";
import DataTablePlayers from "@/components/tables/players-table";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  let name = searchParams.get("name") ?? "Team Name";
  let id = searchParams.get("id") ?? "1";

  // Get this data from the database
  const averageRank = "Grandmaster  4";
  const formationDate = "2024-06-31";
  const players = "5";
  name = name ?? "Team Name"; // Update this with tournament name if name is changed
  id = id ?? "1";

  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
            <p className="text-muted-foreground pl-1">TeamPlayers Table</p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              Here you can view and edit all the details about the {name}
            </p>
            <p className="text-muted-foreground">
              <strong>Average Rank: </strong> {averageRank}
            </p>
            <p className="text-muted-foreground">
              <strong>Formation Date</strong> {formationDate}
            </p>
            <p className="text-muted-foreground">
              <strong>Players: </strong> {players}
            </p>
          </div>

          {/* Top Banner */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-1 items-center space-x-2">
                {/* Add Information Button */}
                <CardWithFormEditTeam name={name} />

                <div>
                  <p>|</p>
                </div>

                {/* Edit Information Button */}
                <CardWithForm />

                {/* Edit Information Button */}
                <PlayerCardWithForm />
              </div>
            </div>

            {/* Table Section */}
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                {/* Add Data Table*/}
                <DataTablePlayers />
              </div>
            </div>

            <div className="flex items-center justify-between px-2"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
