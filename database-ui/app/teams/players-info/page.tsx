/* eslint-disable no-unused-vars, no-redeclare */
"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, Suspense, useEffect, useCallback } from "react";
import Nav from "@/components/header-bar";
import Foot from "@/components/site-footer";
import DataTablePlayers from "@/components/tables/team-players-table";

/* API Route to populate the Players table */
const TEAMS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/`;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") ?? "1";
  const [name, setName] = useState(searchParams.get("name") ?? "Player Name");
  const [players, setplayers] = useState("Loading...");
  const [formationDate, setFormationDate] = useState("Loading...");
  const [averageRank, setAverageRank] = useState("Loading...");

  const fetchTeamPlayerInfo = useCallback(async () => {
    const response = await fetch(`${TEAMS_API_URL}?id=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    const [player] = result.playersRows;
    setName(player.name);
    setplayers(player.players);
    setFormationDate(player.formationDate);
    setAverageRank(player.averageRank);
  }, [id]);

  useEffect(() => {
    fetchTeamPlayerInfo().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });
  }, [fetchTeamPlayerInfo, id]);

  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
            <p className="text-muted-foreground text-1xl">
              <span className="font-bold ">
                TeamPlayers Intersection Table
              </span>{" "}
              - View and edit all the details about {name}
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              Players must have 1 to 3 roles assigned (NOT NULL).
            </p>
            <p className="text-muted-foreground">
              Team average rank is based solely on each player's highest rank,
              ignoring unused roles.
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              To view and edit player details, click the action menu (...) next
              to their name and select 'View Player Details'.
            </p>
            <p className="text-muted-foreground pt-4">
              <strong>Average Rank: </strong> {averageRank}
            </p>
            <p className="text-muted-foreground">
              <strong>Formation Date: </strong> {formationDate}
            </p>
            <p className="text-muted-foreground">
              <strong>Players: </strong> {players}
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-md border bg-card text-card-foreground shadow">
              <div className="relative w-full overflow-auto">
                <DataTablePlayers
                  id={id}
                  fetchTeamPlayerInfo={fetchTeamPlayerInfo}
                />
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
