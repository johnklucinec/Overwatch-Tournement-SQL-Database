"use client";

import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* API Route to populate the TEAMS table */
const TEAMPLAYERS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teamplayers/`;

export type Player = {
  id: string;
  name: string;
  roles: string[];
};

const FormSchema = z.object({
  player: z.string({
    required_error: "Please select a player.",
  }),
});


type PlayersComboBoxProps = {
  iid?: string;
  eid?: string;
  // eslint-disable-next-line no-unused-vars
  onPlayerSelect: (player: Player) => void;
  reset: boolean;
};

export default function PlayersComboBox({ iid, eid, onPlayerSelect, reset }: PlayersComboBoxProps) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [data, setData] = useState<Player[]>([]);

  /* Load and Update the table information */
  let query = "";

  if (iid) {
    query = `${TEAMPLAYERS_API_URL}?iid=${iid}`;
  } else if (eid) {
    query = `${TEAMPLAYERS_API_URL}?eid=${eid}`;
  }

  const fetchPlayers = useCallback(async () => {
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    setData(result.playerRolesRows);
  }, [query]);

  useEffect(() => {
    fetchPlayers().catch((e) => {
      console.error(
        "An error occurred while fetching the teamplayers data.",
        e
      );
    });
  }, [fetchPlayers]);

  useEffect(() => {
    if (reset) {
      form.reset({ player: "" });
    }
  }, [form, reset]);

  return (
    <FormField
      control={form.control}
      name="player"
      render={({ field }) => (
        <FormItem className="flex flex-col flex-grow">
          <FormLabel>Player: </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? data.find((player) => player.id === field.value)?.name
                    : "Select player"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search player..." />
                <CommandEmpty>No player found.</CommandEmpty>
                <CommandGroup>
                  {data.map((player) => (
                    <CommandItem
                    value={player.name}
                    key={player.id}
                    onSelect={() => {
                      form.setValue("player", player.id);
                      onPlayerSelect(player);
                    }}
                  >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          player.id === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {player.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
