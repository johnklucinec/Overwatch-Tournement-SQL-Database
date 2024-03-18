"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/toggle-mode";

export default function DarkModeCard() {
  return (
    <Card className={cn("w-[400px] mb-3")}>
      <CardHeader className="p-4">
        <CardTitle >Dark Mode</CardTitle>
        <CardDescription>
          Did you know there's a dark mode option? It might be easier on your
          eyes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid p-4">
        <div className=" flex items-center rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Toggle Mode
            </p>
            <p className="text-sm text-muted-foreground">
              Accessible from the top left corner.
            </p>
          </div>
          <ModeToggle />
        </div>
      </CardContent>
    </Card>
  );
}
