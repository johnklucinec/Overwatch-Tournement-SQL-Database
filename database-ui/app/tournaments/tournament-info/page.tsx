/* eslint-disable no-unused-vars, no-redeclare */
"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, Suspense, useEffect, useCallback } from "react";
import Nav from "@/components/header-bar";

import DataTableTournamentTeams from "@/components/tables/tournament-teams-table";

/* API Route to populate the Players table */
const TOURNAMENTS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/tournaments/`;

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
  const [name, setName] = useState(searchParams.get("name") ?? "Tournament Name");

  // Get this data from the database
  const [startDate, setStartDate] = useState("loading...");
  const [endDate, setEndDate] = useState("loading...");
  const [status, setstatus] = useState("loading...");

  // Fetch the team's information
  const fetchTournamentTeamsInfo = useCallback(async () => {
    const response = await fetch(`${TOURNAMENTS_API_URL}?id=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Update the state with the fetched data
    const [tournament] = result.tournamentsRows;
    setName(tournament.name);
    setStartDate(tournament.startDate);
    setEndDate(tournament.endDate);
    setstatus(tournament.status);
  }, [id]); 

    /* Load and update the player information */
    useEffect(() => {
      fetchTournamentTeamsInfo().catch((e) => {
        console.error("An error occurred while fetching the players data.", e);
      });
    }, [fetchTournamentTeamsInfo, id]);

  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"> 

        <div className="flex flex-col items-left justify-beginning space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
          <p className="text-muted-foreground pl-1">TournamentTeams Table</p>
          <div className="rounded-md border"></div>
          <p className="text-muted-foreground">Here you can view and edit all the details about the {name}</p>
          <p className="text-muted-foreground">
            <strong>Status:</strong> {status}
          </p>
          <p className="text-muted-foreground">
            <strong>Start Date:</strong> {startDate}
          </p>
          <p className="text-muted-foreground">
            <strong>End Date:</strong> {endDate}
          </p>
        </div>

        {/* Top Banner */}
        <div className="space-y-4">

          {/* Table Section */}
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
            {/* Add Data Table*/}
            <DataTableTournamentTeams id={id}fetchTournamentTeamsInfo={fetchTournamentTeamsInfo}/>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
          </div>
        </div>
        </div>
      </div>
    </main>
  )
}