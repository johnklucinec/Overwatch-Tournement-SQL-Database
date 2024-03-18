"use client";

import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

/* API Route to populate the ROLES table */
const RANKS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/ranks/`;

/**
 * Schema to check for user error
 */
/**
 * Schema to check for user error
 */
export const FormSchema = z.object({
  rankName: z
    .string()
    .min(1, {
      message: "Please enter a rank name.",
    })
    .max(20, {
      message: "Rank name is too long.",
    }),
  division: z
    .string()
    .min(1, {
      message: "Please enter a division.",
    })
    .max(20, {
      message: "Division is too long.",
    }),
  mmr: z
    .number()
    .min(0, {
      message: "MMR cannot be less than 0.",
    })
    .max(10000, {
      message: "MMR cannot be more than 10000.",
    }),
});

/**
 * All the Available Rank Names
 */
const availableRankNames = [
  { label: "Bronze", value: "Bronze" },
  { label: "Silver", value: "Silver" },
  { label: "Gold", value: "Gold" },
  { label: "Platinum", value: "Platinum" },
  { label: "Diamond", value: "Diamond" },
  { label: "Master", value: "Master" },
  { label: "Grandmaster", value: "Grandmaster" },
  { label: "Champion", value: "Champion" },
] as const;

/**
 * All the Available Divisions
 */
const availableDivisions = [
  { label: "5", value: "5" },
  { label: "4", value: "4" },
  { label: "3", value: "3" },
  { label: "2", value: "2" },
  { label: "1", value: "1" },
] as const;

/**
 * Toast that shows what the user submitted and the response.
 */
function showSubmissionToast(
  data: z.infer<typeof FormSchema>,
  response: { message: string; status: number }
) {
  toast({
    title: "You submitted the following values:",
    description: (
      <div>
        <pre className="mt-2 mb-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
        <p className="mt-2">
          <strong>Response Message:</strong> {response.message}
        </p>
        <p className="mt-2">
          <strong>Status:</strong> {response.status}
        </p>
      </div>
    ),
  });
}

/**
 * Processes the HTTP response from a server request.
 * If the response is OK, it parses the response body as JSON and returns it.
 * If the response is not OK, it tries to extract an error message from the response body and logs it.
 * Regardless of the response status, it shows a toast notification with the status and either the success or error message.
 */

async function processResponse(
  response: Response,
  data: {
    rankName: string;
    division: string;
    mmr: number;
  }
) {
  let message = "Unknown error";
  let result;

  try {
    result = await response.json();
    message = result.message || "Unknown error";
    if (!response.ok) {
      console.error("Error parsing response body:", message);
      showSubmissionToast(data, { message, status: response.status });
      return;
    }
  } catch (e) {
    console.error("Error parsing response body:", e);
    showSubmissionToast(data, {
      message: "Error parsing response body",
      status: response.status,
    });
    return;
  }

  // Display the data the user submitted in a toast popup.
  /*
   * @param data - The data submitted by the user.
   * @param message - Error message from fetch APIs or above
   * @param status - Contains status code from fetch APIs
   */
  showSubmissionToast(data, { message, status: response.status });

  return result;
}

/**
 * Function to add the Rank
 */
async function addRank(rankName: string, division: string, mmr: number) {
  const response = await fetch(RANKS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rankName, division, mmr }),
  });

  return response;
}

export default function CreateRanksInputForm() {
  const [openName, setOpenName] = React.useState(false);
  const [openDivision, setOpenDivision] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Process the "Submit" button
  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      const response = await addRank(data.rankName, data.division, data.mmr);

      // Sends the response and data to be processed
      const result = processResponse(response, {
        rankName: data.rankName,
        division: data.division,
        mmr: data.mmr,
      });

      // Reset the form after submission, if the response is ok.
      form.reset({
        rankName: "", 
        division: "", 
        mmr: undefined, 
      });

      return result;
    },
    [form]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="space-y-2"
      >
        <div className="flex">
          <FormField
            control={form.control}
            name="rankName"
            render={({ field }) => (
              <FormItem className="flex flex-col mr-2">
                <FormLabel>Rank</FormLabel>
                <Popover open={openName} onOpenChange={setOpenName}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        name="combobox"
                        className={cn(
                          "justify-between w-[230px]",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? availableRankNames.find(
                              (rank) => rank.value === field.value
                            )?.label
                          : "Select rank"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search rank..." />
                      <CommandEmpty>No rank found.</CommandEmpty>
                      <CommandGroup>
                        {availableRankNames.map((rank) => (
                          <CommandItem
                            value={rank.label}
                            key={rank.value}
                            onSelect={() => {
                              form.setValue("rankName", rank.value);
                              setOpenName(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                rank.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {rank.label}
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

          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem className="flex flex-col ml-2">
                <FormLabel>Division</FormLabel>
                <Popover open={openDivision} onOpenChange={setOpenDivision}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        name="combobox"
                        className={cn(
                          "justify-between w-[100px]",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? availableDivisions.find(
                              (division) => division.value === field.value
                            )?.label
                          : "Division"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search division..." />
                      <CommandEmpty>No division found.</CommandEmpty>
                      <CommandGroup>
                        {availableDivisions.map((division) => (
                          <CommandItem
                            value={division.label}
                            key={division.value}
                            onSelect={() => {
                              form.setValue("division", division.value);
                              setOpenDivision(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                division.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {division.label}
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
        </div>

        <FormField
        control={form.control}
        name="mmr"
        render={({ field }) => (
            <FormItem>
              <FormLabel>MMR</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={field.value === undefined ? "0-10000" : ""}
                  value={field.value === undefined ? "" : field.value}
                  onChange={(e) => {
                  form.setValue("mmr", e.target.value ? Number(e.target.value) : 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
        )}
        />


        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
