/* eslint-disable no-unused-vars, no-redeclare */
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Nav from "@/components/header-bar";
import React from "react";

import CardWithForm from "@/components/cards-and-sheets/edit-player-dialog";
import DataTablePlayers from "@/components/tables/player-roles-table";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const searchParams = useSearchParams();
  let name = searchParams.get("name") ?? "Player Name";
  let id = searchParams.get("id") ?? "1";

  // Get this data form the database
  const highestRank = "Grandmaster  4";
  const createdDate = "2002-07-18";
  const email = "playername@tournament.com";
  name = name ?? "Player Name"; // Update this with tournament name if name is changed

  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
            <p className="text-muted-foreground pl-1">PlayerRoles Table</p>
          <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              Here you can view and edit all the details about the {name}
            </p>
            <p className="text-muted-foreground">
              <strong>Highest Rank: </strong> {highestRank}
            </p>
            <p className="text-muted-foreground">
              <strong>Date Added: </strong> {createdDate}
            </p>
            <p className="text-muted-foreground">
              <strong>Email: </strong> {email}
            </p>
          </div>

          {/* Top Banner */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-1 items-center space-x-2">
                {/* Edit Information Button */}
                <CardWithForm />
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
