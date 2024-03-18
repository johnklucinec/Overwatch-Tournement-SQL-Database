/*
Citation for the following code:
Date: 3/18/2024
Adapted from shadcn GitHub:
Source URL: https://github.com/shadcn-ui/ui/issues/926
*/

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider  defaultTheme="dark" {...props}>{children}</NextThemesProvider>;
}