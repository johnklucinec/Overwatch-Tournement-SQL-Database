"use client";

import { useSearchParams } from "next/navigation";
import Nav from "@/components/header-bar";
import React, { useState, Suspense, useEffect, useCallback } from "react";

import DataTablePlayers from "@/components/tables/player-roles-table";

/* API Route to populate the Players table */
const PLAYERS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/players/`;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const searchParams = useSearchParams();

  const [id] = useState(searchParams.get("id") ?? "1");
  const [name, setName] = useState(searchParams.get("name") ?? "Player Name");
  const [email, setEmail] = useState("loading...");
  const [createdDate, setCreatedDate] = useState("loading...");
  const [highestRank, setHighestRank] = useState("loading...");

  // Fetch the player information
  const fetchPlayerInfo = useCallback(async () => {
    const response = await fetch(`${PLAYERS_API_URL}?id=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Update the state with the fetched data
    const [player] = result.playersRows;
    setName(player.name);
    setEmail(player.email);
    setCreatedDate(player.createdAt);
    setHighestRank(player.highestRank);
  }, [id]); 

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
            <p className="text-muted-foreground pl-1">PlayerRoles Table</p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              Here you can view and edit all the details about the {name}
            </p>
            <p className="text-muted-foreground">
              <strong>Player ID: </strong> {id}
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
            {/* Table Section */}
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                {/* Add Data Table*/}

                <DataTablePlayers id={id} fetchPlayerInfo={fetchPlayerInfo} />
              </div>
            </div>

            <div className="flex items-center justify-between px-2"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
