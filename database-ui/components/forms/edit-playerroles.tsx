"use client"

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/components/forms/edit-playerroles-form";
import { z } from "zod";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Ranks for the drop down menus
const ranks =  [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grandmaster",
  "Champion",
];

// Divisions for the drop down menus
const divisions =  ["5", "4", "3", "2", "1"];

// Prop validation. Uses schema imported from parent form.
interface RankRoleProps {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  playerRole: string;
}

export const RankRole: React.FC<RankRoleProps> = ({ form, playerRole}) => {

// Creates FromField names based on selected role.
  const rankName = React.useMemo(() => `${playerRole.toLowerCase()}Rank` as keyof z.infer<
    typeof FormSchema
  >, [playerRole]);
  const divisionName = React.useMemo(() => `${playerRole.toLowerCase()}Division` as keyof z.infer<
    typeof FormSchema
  >, [playerRole]);

// Notice this is not a complete form, rather some form items and labels.
  return (
    <div className="">
      <FormLabel>{String(playerRole)}</FormLabel>
      <div className="flex space-x-4 rounded-md border p-2">
        <FormField
          control={form.control}
          name={rankName}
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Rank</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl className=" w-[275px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rank" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ranks.map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={divisionName}
          render={({ field }) => (
            <FormItem className="flex-auto">
              <FormLabel>Division</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl className=" w-[150px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a division" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RankRole;
