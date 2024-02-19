/* eslint-disable no-unused-vars, no-redeclare */
'use client'

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
       onClick={toggleCardVisibility}>{name ? 'Edit' : 'Add'} Team</Button>

      {/* Overlay container for the card */}
      {showCard && (
        <div data-state={animation ? 'open' : 'closed'} className="fixed items-center justify-center left-[50%] top-[40%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          {/* Actual card */}

        <Card className="w-[450px]">
              <CardHeader>
                <CardTitle>Create Team</CardTitle>
                <CardDescription>Add your team to the database</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder={name ? name : 'Name of your team'} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    </div>
                  </div>
                </form>
              </CardContent>

              {/* Edit the functions of the buttons*/}
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={toggleCardVisibility}>Cancel</Button>
                <Button onClick={toggleCardVisibility}>Add Team</Button>

              </CardFooter>
            </Card>
            <div/>
            </div>
      )}
    </div>
  );
}