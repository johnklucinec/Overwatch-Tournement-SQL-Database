<<<<<<< HEAD
/*
Citation for the following code:
Date: 3/18/2024
Installed from shadcn GitHub:
Source URL: https://github.com/shadcn-ui/ui
*/
=======
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
/* eslint-disable react/prop-types */
"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
