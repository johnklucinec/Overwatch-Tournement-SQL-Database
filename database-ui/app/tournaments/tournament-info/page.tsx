"use client"
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Nav from "@/components/header-bar";
<<<<<<< Updated upstream
import React from 'react';
=======
import Foot from "@/components/site-footer";
>>>>>>> Stashed changes

import ImportSheet from "@/components/cards-and-sheets/edit-tournament-sheet";
import DataTableTeams from "@/components/tables/teams-table";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const searchParams = useSearchParams();
<<<<<<< Updated upstream
  let name = searchParams.get('name') ?? 'Pachimari Tournament';

  // Get this data from the database
  const startDate = "2024-03-02";
  const endDate = "2024-06-31";
  const status = "Enrollment Open";

  // Update this with tournament name if name is changed
  name = name ?? 'Tournament';

=======

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
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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
          <div className="flex items-center justify-between">

            <div className="flex flex-1 items-center space-x-2">
            {/* Add Information Button */}
            <ImportSheet name={name} />
            </div>

          </div>

          {/* Table Section */}
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
            {/* Add Data Table*/}
            <DataTableTeams />
=======
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
>>>>>>> Stashed changes
            </div>

            <div className="flex items-center justify-between px-2"></div>
          </div>
        </div>
      </div>
      <Foot />
    </main>
  );
}
