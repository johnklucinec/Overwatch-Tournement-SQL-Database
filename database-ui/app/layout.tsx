import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Overwatch 2 Tournament DBMS",
  description: "A powerful Database Management System (DBMS) specifically designed for Overwatch 2 tournaments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
