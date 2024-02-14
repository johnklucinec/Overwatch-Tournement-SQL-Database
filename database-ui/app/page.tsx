import React from 'react';
import Nav from "@/components/header-bar"


export default function Home() {
  return (
    <main className="p-24">
      <Nav />
      <section className="pt-24 pb-8 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl font-bold">Overwatch Tournament DBMS</h1>
        <p className="text-1xl text-muted-foreground">Created by: John Klucienc and Troy Hoffman</p>
      </section>
      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl min-w-[600px] max-w-[50%] mx-auto pl-4 pr-4">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex ">  
          <section className="py-5 flex flex-col items-center text-center gap-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Navigating the Tables</h2>
            <p className="text-base leading-relaxed">
              To view the tables located in the top navigation bar, simply click on any of the options above. Some tables offer an action menu, represented by three dots (...), which allows you to select "View Entity Details" for a more detailed view of the selected entity. This is where you will find the rest of the tables.
            </p>
          </section>
        </div>
      </div>

        <div className="hidden h-full flex-1 flex-col space-y-8 pl-8 pr-8 md:flex min-w-[600px] max-w-[50%] mx-auto">  
          <section className="py-5 flex flex-col items-center text-center gap-8">
            <h2 className="text-2xl font-semibold text-primary">Notice</h2>
            <p className="text-base leading-relaxed">
              The website contains sample data. Most of the buttons function, but they do no do anything yet. 
            </p>
          </section>
        </div>

    </main>
  );
}

