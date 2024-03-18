/* eslint-disable no-unused-vars, no-redeclare */
"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, Suspense, useEffect, useCallback } from "react";
import Nav from "@/components/header-bar";
import Foot from "@/components/site-footer";

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
  const [name, setName] = useState(
    searchParams.get("name") ?? "Tournament Name"
  );

  // Get this data from the database
  const [startDate, setStartDate] = useState("loading...");
  const [endDate, setEndDate] = useState("loading...");
  const [status, setStatus] = useState("loading...");
  const [teams, setTeams] = useState("loading...");

  // Fetch the tournament's information
  const fetchTournamentInfo = useCallback(async () => {
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
    setStatus(tournament.status);
    setTeams(tournament.teams);
  }, [id]);

  /* Load and update the tournament information */
  useEffect(() => {
    fetchTournamentInfo().catch((e) => {
      console.error(
        "An error occurred while fetching the tournament data.",
        e
      );
    });
  }, [fetchTournamentInfo, id]);

  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex flex-col items-left justify-beginning space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
            <p className="text-muted-foreground text-1xl">
              <span className="font-bold ">
                TournamentTeams Intersection Table
              </span>{" "}
              - View and edit all the details about {name}
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
            Teams can have zero or more Players (NULLable), and Teams can be
              in Multiple Tournaments (M:M). 
            </p>
            <p className="text-muted-foreground">
            Removing a team only removes them from the TournamentTeams table.
            </p>
            <div className="rounded-md border"></div>
            <p className="text-muted-foreground">
              To view and edit a Team's details, click the action menu (...) next to their
              name and select 'View Team Details'.
            </p>
            <p className="text-muted-foreground">
              <strong>Status:</strong> {status}
            </p>
            <p className="text-muted-foreground">
              <strong>Start Date:</strong> {startDate}
            </p>
            <p className="text-muted-foreground">
              <strong>End Date:</strong> {endDate}
            </p>
            <p className="text-muted-foreground">
              <strong>Teams:</strong> {teams}
            </p>
          </div>

          {/* Top Banner */}
          <div className="space-y-4">
            {/* Table Section */}
            <div className="rounded-md border bg-card text-card-foreground shadow">
              <div className="relative w-full overflow-auto">
                {/* Add Data Table*/}
                <DataTableTournamentTeams
                  id={id}
                  fetchTournamentTeamsInfo={fetchTournamentInfo}
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
