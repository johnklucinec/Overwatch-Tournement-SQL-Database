"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import Nav from "@/components/header-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import CardWithForm from "@/app/players/player-info/card";
import DataTablePlayers from "@/components/player-roles-table";

export default function Page() {

  const searchParams = useSearchParams();
  let name = searchParams.get('name') ?? 'Player Name';
  let id = searchParams.get('id') ?? '1';

  // Get this data form the database
  const highestRank = "Grandmaster 4"
  const createdDate = "2002-07-18"
  const email = "playername@tournament.com"
  name = name ?? 'Player Name' // Update this with tournament name if name is changed

  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"> 

        <div className="flex flex-col items-left justify-beginning space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
          <p className="text-muted-foreground">Here you can view and edit all the details about the {name}</p>

          <div className="rounded-md border"></div>
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
            {/* Add Information Button */}
            <CardWithForm name={name} />

            {/* Edit Information Button */}
            <CardWithForm name={name} />
            </div>

          </div>

          {/* Table Section */}
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
            {/* Add Data Table*/}
            <DataTablePlayers />
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