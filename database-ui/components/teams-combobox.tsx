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
const TOURNAMENTPLAYERS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/tournamentteams/`;

export type Team = {
  id: string;
  name: string;
};

const FormSchema = z.object({
  team: z.string({
    required_error: "Please select a team.",
  }),
});

type TeamsComboBoxProps = {
  id?: string;
  // eslint-disable-next-line no-unused-vars
  onTeamSelect: (team: Team) => void;
  reset: boolean;
};

export default function TeamsComboBox({
  id,
  onTeamSelect,
  reset,
}: TeamsComboBoxProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [data, setData] = useState<Team[]>([]);

  /* Load and Update the table information */
  let query = "";
  if (id) {
    query = `${TOURNAMENTPLAYERS_API_URL}?eid=${id}`;
  }

  const fetchTeams = useCallback(async () => {
    setLoading(true);

    const response = await fetch(query);
    if (!response.ok) {
      if(response.status === 409) {
        console.log('No Teams avaiable to add to this tournament.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    const result = await response.json();
    setData(result.tournamentTeamsRows);

    setLoading(false);
  }, [query]);

  useEffect(() => {
    fetchTeams().catch((e) => {
      if(e.message.includes('409')) {
        console.log('No Teams avaiable to add to this tournament.');
      } else {
        throw new Error(`HTTP error! status: ${e.status}`);
      }
    });
  }, [fetchTeams]);

  useEffect(() => {
    if (reset) {
      form.reset({ team: "" });
    }

    fetchTeams().catch((e) => {
      if(e.message.includes('409')) {
        console.log('No Teams avaiable to add to this tournament.');
      } else {
        throw new Error(`HTTP error! status: ${e.status}`);
      }
    });

  }, [form, reset, fetchTeams]);

  return (
    <FormField
      control={form.control}
      name="team"
      render={({ field }) => (
        <FormItem className="flex flex-col flex-grow">
          <FormLabel>Team: </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
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
                    ? data.find((team) => team.id === field.value)?.name
                    : "Select team"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent side="bottom" className="p-0">
              <Command>
                <CommandInput placeholder="Search team..." />
                {loading ? (
                  <CommandEmpty>Loading...</CommandEmpty>
                ) : !data || data.length === 0 ? (
                  <CommandEmpty>No Teams</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {data.map((team) => (
                      <CommandItem
                        value={team.name}
                        key={team.id}
                        onSelect={() => {
                          form.setValue("team", team.id);
                          onTeamSelect(team);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            team.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {team.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
