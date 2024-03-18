/*
Citation for the following code:
Date: 3/18/2024
Adapted from shadcn GitHub:
Source URL: https://github.com/shadcn-ui/ui/blob/main/apps/www/components/site-footer.tsx
*/

"use client";

import React from "react";

export default function SiteFooter() {
  return (
<footer className="py-6 md:px-8 md:py-0">
  <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
    <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
      Built by{" "}
      <a
        href={process.env.NEXT_PUBLIC_PORTFOLIO || ""}
        target="_blank"
        rel="noreferrer"
        className="font-medium underline underline-offset-4"
      >
        John Klucinec
      </a>
      . The source code is available on{" "}
      <a
        href={process.env.NEXT_PUBLIC_GITUHB || ""}
        target="_blank"
        rel="noreferrer"
        className="font-medium underline underline-offset-4"
      >
        GitHub
      </a>
      .
    </p>
  </div>
</footer>
  )
}