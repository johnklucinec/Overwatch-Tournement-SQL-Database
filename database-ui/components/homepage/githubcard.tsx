"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

<<<<<<< HEAD
function raiseInvoiceClicked({ url }: { url: string }) {
  window.open(url, "_blank");
}

=======
// eslint-disable-next-line react/prop-types
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
export default function DarkModeCard() {
  return (
    <Card className={cn("w-[600px] mb-3 ml-2")}>
      <CardHeader className="mb-4">
        <CardTitle>Team Members</CardTitle>
<<<<<<< HEAD
        <CardDescription>People who worked on this project.</CardDescription>
=======
        <CardDescription >
          People who worked on this project. 
        </CardDescription>
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex space-x-4">
            <Avatar className="w-16 h-16">
<<<<<<< HEAD
              <AvatarImage src={`${process.env.NEXT_PUBLIC_JOHN_GITHUB}.png` || ""} />
=======
              <AvatarImage src="https://github.com/johnklucinec.png" />
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
              <AvatarFallback>JK</AvatarFallback>
            </Avatar>
            <div>
              <div className="card rounded-lg px-4 shadow-sm">
                <p className="text-base font-medium leading-tight">
                  John Klucinec
                </p>
                <ul className="list-none space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Project Coordinator</li>
                  <li>Website Designer</li>
                  <li>Database Designer</li>
                  <li>API Designer</li>
                </ul>
              </div>
            </div>
          </div>
<<<<<<< HEAD
          <Button
            className="ml-auto"
            onClick={() =>
              raiseInvoiceClicked({
                url: process.env.NEXT_PUBLIC_JOHN_GITHUB || "",
              })
            }
          >
=======

          <Button variant="outline" className="ml-auto">
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
            View GitHub
          </Button>
        </div>
        <div className="flex items-center justify-between space-x-4">
<<<<<<< HEAD
          <div className="flex space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`${process.env.NEXT_PUBLIC_TROY_GITHUB}.png` || ""} />
=======
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="https://github.com/RemyTroy.png" />
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
            <div>
              <div className="card rounded-lg px-4 py-2 shadow-sm">
                <p className="text-base font-medium leading-tight">
                  Troy Hoffman
                </p>
                <ul className="list-none space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Quality Assurance</li>
                  <li>Implemented API routes </li>
                  <li>Supported database configuration</li>
                </ul>
              </div>
            </div>
          </div>
<<<<<<< HEAD
          <Button
            className="ml-auto"
            onClick={() =>
              raiseInvoiceClicked({
                url: process.env.NEXT_PUBLIC_TROY_GITHUB || "",
              })
            }
          >
=======
          <Button variant="outline" className="ml-auto">
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
            View GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
