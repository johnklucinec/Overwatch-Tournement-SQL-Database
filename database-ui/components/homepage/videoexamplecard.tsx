"use client";

import * as React from "react";

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";



// eslint-disable-next-line react/prop-types
export default function DarkModeCard() {
  return (
    <Card className={cn("w-[400px] mb-3")}>
      <CardHeader className="p-4">
        <CardTitle>Navigating the Website</CardTitle>
        <CardDescription>Get a comprehensive overview of the website's features in this walkthrough.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">

          <div className="flex-1 lex items-center">
            <Button variant="outline" className="flex w-full h-full">
            Open Walkthrough in YouTube
            </Button>
          </div>
      </CardContent>
    </Card>
  )
}
