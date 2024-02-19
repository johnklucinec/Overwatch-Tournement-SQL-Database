"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/* Sample Data, should be getting info from DATABASE */
const players = [
  {
    id: "1",
    label: "Wintah",
  },
  {
    id: "2",
    label: "Gliscor",
  },
  {
    id: "3",
    label: "HankHarm",
  },
  {
    id: "4",
    label: "PapaJuan",
  },
  {
    id: "5",
    label: "Unicorn",
  },
]

/*
Citation for the following function:
Date: 2/19/2024
Adapted from ComboBox Demo:
Source URL: https://ui.shadcn.com/docs/components/combobox
*/
// eslint-disable-next-line no-unused-vars
export default function PlayersComboBox({ onPlayerSelect }: { onPlayerSelect: (playerId: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [id, setValue] = React.useState("")
  
  const handleSelect = (playerId: string) => {
    setValue(playerId === id ? "" : playerId)
    setOpen(false)
    onPlayerSelect(playerId)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full items-center gap-3 justify-between"
        >
          {id
            ? players.find((player) => player.id === id)?.label
            : "Select player..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search player..." />
          <CommandEmpty>No player found.</CommandEmpty>
          <CommandGroup>
            {players.map((player) => (
              <CommandItem
                  key={player.id}
                  id={player.id}
                  onSelect={() => handleSelect(player.id)}
                >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    id === player.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {player.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}