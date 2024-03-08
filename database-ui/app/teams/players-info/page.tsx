/* eslint-disable no-unused-vars, no-redeclare */
"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, Suspense, useEffect, useCallback } from "react";
import Nav from "@/components/header-bar";

import DataTablePlayers from "@/components/tables/team-players-table";

/* API Route to populate the Players table */
const TEAMPLAYERS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/players/`;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const searchParams = useSearchParams();

  const [id] = useState(searchParams.get("id") ?? "1");
  const [name, setName] = useState(searchParams.get("name") ?? "Player Name");
  const [players, setplayers] = useState("loading...");
  const [formationDate, setFormationDate] = useState("loading...");
  const [averageRank, setAverageRank] = useState("loading...");

  // Fetch the team's player information
  const fetchPlayerInfo = useCallback(async () => {
    const response = await fetch(`${TEAMPLAYERS_API_URL}?id=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Update the state with the fetched data
    const [player] = result.playersRows;
    setName(player.name);
    setplayers(player.players);
    setFormationDate(player.date);
    setAverageRank(player.averageRank);
  }, [id]); // Add an empty array as the second argument

  /* Load and update the player information */
  useEffect(() => {
    fetchPlayerInfo().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });
  }, [fetchPlayerInfo, id]);

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
