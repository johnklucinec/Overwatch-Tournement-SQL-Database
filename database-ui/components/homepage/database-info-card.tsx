// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/dashboard/page.tsx

"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TOURNAMENTINFO_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/tournament-info/`;

export default function DatabaseInfoCard() {
  const [tournamentsCount, setTournamentCount] = useState("0");
  const [teamsCount, setTeamsCount] = useState("0");
  const [playersCount, setPlayersCount] = useState("0");
  const [ranksCount, setRanksCount] = useState("0");

  // Fetch the player information
  const fetchInfo = useCallback(async () => {
    const response = await fetch(`${TOURNAMENTINFO_API_URL}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Update the state with the fetched data
    const [info] = result.infoRows;
    setTournamentCount(info.tournamentscount);
    setTeamsCount(info.teamscount);
    setPlayersCount(info.playerscount);
    setRanksCount(info.rankscount);
  }, []);

  /* Load and update the player information */
  useEffect(() => {
    fetchInfo().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });
  }, [fetchInfo]);

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tournaments</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M5 4h4a1 1 0 011 1v4a1 1 0 01-1 1H5M5 14h4a1 1 0 011 1v4a1 1 0 01-1 1H5M10 7h4a1 1 0 011 1v8a1 1 0 01-1 1h-4M15 12h5" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tournamentsCount}</div>
          <p className="text-xs text-muted-foreground">
            Total number of tournaments
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Teams</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teamsCount}</div>
          <p className="text-xs text-muted-foreground">
            Total number of teams
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Players</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{playersCount}</div>
          <p className="text-xs text-muted-foreground">
            Total number of players
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ranks</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 25"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M16 13 A4 4 0 0 1 12 17 A4 4 0 0 1 8 13 A4 4 0 0 1 16 13 z" />
            <path d="M9 10L8 8H3l2.48 5.788A2 2 0 007.32 15H8.5M15 10l1-2h5l-2.48 5.788A2 2 0 0116.68 15H15.5" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ranksCount}</div>
          <p className="text-xs text-muted-foreground">
            Total number of distinct ranks
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
