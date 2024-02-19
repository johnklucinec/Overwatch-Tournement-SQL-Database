/* eslint-disable no-unused-vars, no-redeclare */
'use client'

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface CardWithForm {
  name?: string; // This makes the name prop optional
}

export default function CardWithForm({ name }: CardWithForm) {
  // State to handle the visibility of the card
  const [showCard, setShowCard] = useState(false);
  // State to handle the animation
  const [animation, setAnimation] = useState(false);

  const toggleCardVisibility = () => {
    // Check if there's an animation state
    if (animation) {
      setAnimation(!animation);
      setTimeout(() => {
        setShowCard(!showCard);
      },  200); // Delay for  200ms
    } else {
      setAnimation(!animation);
      setShowCard(!showCard);
    }
  };

  return (
    <div>
      {/* Button to trigger the card visibility */}
      <Button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background"
       onClick={toggleCardVisibility}>Edit Player</Button>

      {/* Overlay container for the card */}
      {showCard && (
        <div data-state={animation ? 'open' : 'closed'} className="fixed items-center justify-center left-[50%] top-[40%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          {/* Actual card */}

        <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Create Team</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Player's Name" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="next">TANK</SelectItem>
                          <SelectItem value="sveltekit">DPS</SelectItem>
                          <SelectItem value="astro">SUPPORT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>
              </CardContent>

              {/* Edit the functions of the buttons*/}
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={toggleCardVisibility}>Cancel</Button>
                <Button onClick={toggleCardVisibility}>Add Player</Button>

              </CardFooter>
            </Card>
            <div/>
            </div>
      )}
    </div>
  );
}