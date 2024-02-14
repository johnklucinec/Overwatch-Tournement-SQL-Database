import Nav from "@/components/header-bar"

import DataTableRanks from "@/components/ranks-table"
import DataTableRoles from "@/components/roles-table"

export default function Page() {
  return (
    <main className="p-24">
      <Nav />

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"> 

        <div className="flex flex-col items-left justify-beginning space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Ranks and Roles</h2>
          <p className="text-muted-foreground">Here you can view and edit all the teams</p>
        </div>

        {/* Top Banner */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">

            <div className="flex flex-1 items-center space-x-2"></div>

          </div>

          {/* Table Section */}
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">



            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

          <div className="rounded-xl border bg-card text-card-foreground shadow col-span-4">
            <div className="flex flex-col pt-6 pl-6">
              <h2>Ranks</h2>
            </div>
            <div className="flex flex-col pl-6 pr-6">
              {/* Add Data Table*/}
              <DataTableRanks />
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow col-span-3">
            <div className="flex flex-col space-y-1.5 pl-6 pr-6">
              <h2>Roles</h2>
            </div>
            <div className="p-6 pt-0">
              {/* Add Data Table*/}
              <DataTableRoles />
            </div>
          </div>

          </div>

          <div className="flex items-center justify-between px-2">
          </div>
        </div>
        </div>
      </div>
    </main>
  )
}