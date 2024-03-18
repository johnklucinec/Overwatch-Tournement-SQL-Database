"use client";

import * as React from "react";

<<<<<<< HEAD
import { cn } from "@/lib/utils";
=======
import { cn } from "@/lib/utils"
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
<<<<<<< HEAD
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function raiseInvoiceClicked({ url }: { url: string }) {
  window.open(url, "_blank");
}

=======
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";



// eslint-disable-next-line react/prop-types
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
export default function DarkModeCard() {
  return (
    <Card className={cn("w-[400px] mb-3")}>
      <CardHeader className="p-4">
        <CardTitle>Navigating the Website</CardTitle>
<<<<<<< HEAD
        <CardDescription>
          Get a comprehensive overview of the website's features in this
          walkthrough.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="flex-1 lex items-center">
          <Button
            className="flex w-full h-full"
            onClick={() =>
              raiseInvoiceClicked({
                url: process.env.NEXT_PUBLIC_WALKTHROUGH || "",
              })
            }
          >
            Open Walkthrough in YouTube
          </Button>
        </div>
      </CardContent>
    </Card>
  );
=======
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
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
}
