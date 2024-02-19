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
import { Label } from "@/components/ui/label";
import { useState } from "react";

import PlayersComboBox from '@/components/players-combobox';
import { Checkbox } from "@/components/ui/checkbox";

export default function CardWithForm() {
  // State to handle the visibility of the card
  const [showCard, setShowCard] = useState(false);
  // State to handle the animation
  const [animation, setAnimation] = useState(false);
  // State to hold the selected player's id
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const toggleCardVisibility = () => {
    // Check if there's an animation state
    if (animation) {
      setAnimation(!animation);
      setTimeout(() => {
        setShowCard(!showCard);
      }, 200); // Delay for  200ms
    } else {
      setAnimation(!animation);
      setShowCard(!showCard);
    }
  };

  // Callback function to handle player selection
  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
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
          className="fixed items-center justify-center left-[50%] top-[40%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
        >
          {/* Actual card */}

          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Add Player</CardTitle>
              <CardDescription>
                Add a player to the team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="player">Player</Label>
                    <PlayersComboBox onPlayerSelect={handlePlayerSelect} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="role">Role</Label>
                    <div>
                      <Checkbox id="tank">TANK</Checkbox>
                      <span className="ml-4 text-sm">TANK</span>
                    </div>
                    <div>
                      <Checkbox id="dps">DPS</Checkbox>
                      <span className="ml-4 text-sm">DPS</span>
                    </div>
                    <div>
                      <Checkbox id="support">SUPPORT</Checkbox>
                      <span className="ml-4 text-sm">SUPPORT</span>
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
