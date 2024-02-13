"use client"

import { ModeToggle } from "./ui/toggle-mode"
import NavBar from "@/components/navigation-bar"

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

      <div className="container flex h-14 max-w-screen-2xl items-center">

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-between">
          <NavBar />
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav>
            <ul className="flex items-center justify-end">
              <li>
                <ModeToggle />
              </li>
            </ul>
          </nav>
        </div>
        
      </div>
    </header>
  )
}