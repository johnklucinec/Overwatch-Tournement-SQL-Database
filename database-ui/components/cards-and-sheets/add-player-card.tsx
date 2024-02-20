"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CardWithForm() {
  const [showCard, setShowCard] = useState(false);
  const [animation, setAnimation] = useState(false);

  const toggleCardVisibility = () => {
    setAnimation(!animation);
    setTimeout(() => {
      setShowCard(!showCard);
    }, 200);
  };

  const ranks = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Grandmaster",
    "Champion",
  ];
  const divisions = [1, 2, 3, 4, 5];

  const RankMenu = () => {
    return (
      <div className="flex flex-col space-y-1.5 flex-1 mr-2">
        <Label htmlFor="rank">Rank</Label>
        <Select>
          <SelectTrigger id="rank">
            <SelectValue placeholder="Rank" />
          </SelectTrigger>
          <SelectContent position="popper">
            {ranks.map((rank, index) => (
              <SelectItem key={index} value={rank}>
                {rank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const DivisionMenu = () => {
    return (
      <div className="flex flex-col space-y-1.5 flex-3 mr-2">
        <Label htmlFor="division">Division</Label>
        <Select>
          <SelectTrigger id="division">
            <SelectValue placeholder="Division" />
          </SelectTrigger>
          <SelectContent position="popper">
            {divisions.map((division, index) => (
              <SelectItem key={index} value={String(division)}>
                {division}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const RankAndDivision = () => {
    return (
      <div className="flex">
        <RankMenu />
        <DivisionMenu />
      </div>
    );
  };

  return (
    <div>
      {/* Button to trigger the card visibility */}
      <Button
        className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background"
        onClick={toggleCardVisibility}
      >
        Add Player
      </Button>

      {/* Overlay container for the card */}
      {showCard && (

        <div
          data-state={animation ? "open" : "closed"}
          className="fixed items-center justify-center left-[50vw] top-[40%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
        >
          {/* Actual card */}

          <Card className="w-[450px]">
            <CardHeader>
              <CardTitle>Create Player</CardTitle>
              <CardDescription>Create a New Player</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Player's Name" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Role</Label>
                    <div className="flex flex-col space-y-1.5 rounded-md border p-2">
                      <div className="flex items-center">
                        <Checkbox id="tank" />
                        <span className="ml-2 text-sm">TANK</span>
                      </div>
                      <RankAndDivision />
                    </div>
                    <div className="flex flex-col space-y-1.5 rounded-md border p-2">
                      <div className="flex items-center">
                        <Checkbox id="dps" />
                        <span className="ml-2 text-sm">DPS</span>
                      </div>
                      <RankAndDivision />
                    </div>
                    <div className="flex flex-col rounded-md border p-2">
                      <div className="flex items-center">
                        <Checkbox id="support" />
                        <span className="ml-2 text-sm">SUPPORT</span>
                      </div>
                      <RankAndDivision />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>

            {/* Edit the functions of the buttons*/}
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={toggleCardVisibility}>
                Cancel
              </Button>
              <Button onClick={toggleCardVisibility}>Add Player</Button>
            </CardFooter>
          </Card>

          <div />
        </div>
      )}
    </div>
  );
}
