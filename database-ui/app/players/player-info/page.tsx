"use client";
<<<<<<< HEAD
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Nav from "@/components/header-bar";
<<<<<<< Updated upstream
import React from "react";
=======
import Foot from "@/components/site-footer";
import React, { useState, Suspense, useEffect, useCallback } from "react";
>>>>>>> Stashed changes
=======
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660

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

<<<<<<< HEAD
<<<<<<< Updated upstream
  // Get this data form the database
  const highestRank = "Grandmaster  4";
  const createdDate = "2002-07-18";
  const email = "playername@tournament.com";
  name = name ?? "Player Name"; // Update this with tournament name if name is changed
=======
=======
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
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
<<<<<<< HEAD
  }, [id]);
=======
  }, [id]); 
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660

  /* Load and update the player information */
  useEffect(() => {
    fetchPlayerInfo().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });
  }, [fetchPlayerInfo, id]);
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660

  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
<<<<<<< Updated upstream
            <p className="text-muted-foreground pl-1">PlayerRoles Table</p>
<<<<<<< HEAD
          <div className="rounded-md border"></div>
=======
            <p className="text-muted-foreground text-1xl">
              <span className="font-bold ">
                PlayerRoles Intersection Table
              </span>{" "}
              - View and edit all the details about {name}
            </p>
            <div className="rounded-md border"></div>
>>>>>>> Stashed changes
=======
            <div className="rounded-md border"></div>
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
            <p className="text-muted-foreground">
              Players must have 1 to 3 roles assigned (NOT NULL).
            </p>
            <p className="text-muted-foreground">
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
              Removing a player's team assigned roles will remove them from the
              team (NOT NULL).
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground pt-3">
              <strong>Player ID: </strong> {id}
            </p>
            <p className="text-muted-foreground">
>>>>>>> Stashed changes
=======
              <strong>Player ID: </strong> {id}
            </p>
            <p className="text-muted-foreground">
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
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
            <div className="rounded-md border bg-card text-card-foreground shadow">
              <div className="relative w-full overflow-auto">
                {/* Add Data Table*/}

                <DataTablePlayers id={id} fetchPlayerInfo={fetchPlayerInfo} />
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
