<<<<<<< HEAD
<<<<<<< Updated upstream
import React from 'react';
import Nav from "@/components/header-bar"

=======
import React from "react";
import Nav from "@/components/header-bar";
import Foot from "@/components/site-footer";
=======
import React from "react";
import Nav from "@/components/header-bar";
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
import DarkModeCard from "@/components/homepage/darkmodecard";
import GitHubCard from "@/components/homepage/githubcard";
import VideoCard from "@/components/homepage/videoexamplecard";
import DatabaseInfo from "@/components/homepage/database-info-card";
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660

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
<<<<<<< HEAD
<<<<<<< Updated upstream

        <div className="hidden h-full flex-1 flex-col space-y-8 pl-8 pr-8 md:flex min-w-[600px] max-w-[50%] mx-auto">  
          <section className="py-5 flex flex-col items-center text-center gap-8">
            <h2 className="text-2xl font-semibold text-primary">Notice</h2>
            <p className="text-base leading-relaxed">
              The website contains sample data. Most of the buttons function, but they do no do anything yet. 
            </p>
          </section>
        </div>

=======
      <Foot />
>>>>>>> Stashed changes
=======
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
    </main>
  );
}
