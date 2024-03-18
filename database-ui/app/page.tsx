import React from "react";
import Nav from "@/components/header-bar";
import DarkModeCard from "@/components/homepage/darkmodecard";
import GitHubCard from "@/components/homepage/githubcard";
import VideoCard from "@/components/homepage/videoexamplecard";
import DatabaseInfo from "@/components/homepage/database-info-card";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center  p-24">
      <Nav />
      <div className="flex-1">
        <div className="container relative">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1] hidden md:block">
              Overwatch 2 Tournament DBMS
            </h1>
            <span className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
              An elegant front-end solution built with Next.js, combined with
              NEON Serverless PostgreSQL, allowing you to easily track and
              update player, team, and tournament information.
            </span>
          </div>
          <div>
            <div className="border-b"></div>

            <div className="flex flex-col items-center gap-2 py-8 border-b">
              <span className="max-w-[650px] text-center text-lg text-muted-foreground sm:text-xl">
                While some features are unavailable (read-only), you can still
                browse the website and access available information.
              </span>
            </div>

            <div className="container relative ">
              <div className="pt-6 justify-center">
                <DatabaseInfo />
              </div>

              <div className="flex p-2 mx-auto justify-center items-center max-w-[1006px]">
                <div className="flex m-2 items-center">
                  <div className="">
                    <GitHubCard />
                  </div>
                  <div className="m-2">
                    <div className="flex flex-col items-center">
                      <DarkModeCard />
                      <VideoCard />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
