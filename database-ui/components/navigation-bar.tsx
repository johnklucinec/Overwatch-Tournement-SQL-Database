'use client'

import * as React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NavBar = () => {

  const pathname = usePathname()

  const isHomePage = pathname === "/";
  const isTournamentPage = pathname.startsWith("/tournaments"); // Adjust patterns as needed
  const isTeamsPage = pathname.startsWith("/teams");
  const isPlayersPage = pathname.startsWith("/players");
  const isRanksRolesPage = pathname.startsWith("/ranks-roles");

  return (
    <NavigationMenu>
      <NavigationMenuList>

        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} transition-colors hover:text-foreground/80 ${isHomePage ? "text-foreground" : "text-foreground/50"}`}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>


        <NavigationMenuItem>
          <Link href="/tournaments" legacyBehavior passHref>
            <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} transition-colors hover:text-foreground/80 ${isTournamentPage ? "text-foreground" : "text-foreground/40"}`}
              >
              Tournaments
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/teams" legacyBehavior passHref>
            <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} transition-colors hover:text-foreground/80 ${isTeamsPage ? "text-foreground" : "text-foreground/40"}`}
              >
              Teams
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/players" legacyBehavior passHref>
            <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} transition-colors hover:text-foreground/80 ${isPlayersPage ? "text-foreground" : "text-foreground/40"}`}
              >
              Players
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/ranks-roles" legacyBehavior passHref>
            <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} transition-colors hover:text-foreground/80 ${isRanksRolesPage ? "text-foreground" : "text-foreground/40"}`}
              >
              Ranks and Roles
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavBar;
