import Nav from "@/components/header-bar"
import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <main className="p-24">
      <Nav />
      <section className="py-24 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl font-bold"> Overwatch Tournament DBMS</h1>
        <p className="text-1xl text-muted-foreground">Created by: John Klucienc and Troy Hoffman</p>
      </section>
      <div className="flex gap-6 py-6 items-center justify-center">
      </div>
    </main>
  )
}