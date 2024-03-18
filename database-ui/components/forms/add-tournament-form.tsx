"use client";

import React, { SetStateAction, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* API Route to populate the TEAMS table */
const TOURNAMENTS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/tournaments/`;

/**
 * Schema to check for user error
 */
export const FormSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: "Team Name must be at least 2 characters.",
      })
      .max(20, {
        message: "Team Name must be at most 20 characters.",
      }),
    status: z.string().min(2, {
      message: "Please select a Tournament Status",
    }),
    startDate: z.string().min(2, {
      message: "Please Select a Date",
    }),
    endDate: z.string().min(2, {
      message: "Please Select a Date",
    }),
  })
  .refine(
    (data) => {
      // Check if endDate is provided
      return data.endDate && data.endDate.length >= 2;
    },
    {
      message: "Please Select an End Date",
      path: ["startDate"],
    }
  );

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
    name: string;
    status: string;
    startDate: string;
    endDate: string;
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
 * Function to add the Team
 */
async function addTournament(
  name: string,
  status: string,
  startDate: string,
  endDate: string
) {
  const response = await fetch(TOURNAMENTS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, status, startDate, endDate }),
  });

  return response;
}

export default function CreateTournamentsInputForm() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 10),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      status: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addDays(new Date(), 10), "yyyy-MM-dd"),
    },
  });

  // Process the "Submit" button
  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      const response = await addTournament(
        data.name ?? "",
        data.status ?? "",
        data.startDate ?? "",
        data.endDate ?? ""
      );

      // Sends the response and data to be processed
      const result = processResponse(response, {
        name: data.name ?? "",
        status: data.status ?? "",
        startDate: data.startDate ?? "",
        endDate: data.endDate ?? "",
      });

      // Reset the form after submission
      form.reset({
        name: "",
        status: "",
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(addDays(new Date(), 10), "yyyy-MM-dd"),
      });

      // Reset the state of the Select and DateRange components
      setDate({
        from: new Date(),
        to: addDays(new Date(), 10),
      });

      return result;
    },
    [form]
  );

  // Handle all the date stuff
  const handleDateChange = (
    newDate: SetStateAction<DateRange | undefined>
  ) => {
    if (typeof newDate !== "function") {
      setDate(newDate);
      const { from: startDate, to: endDate } = newDate || {
        from: undefined,
        to: undefined,
      };
      const formattedStartDate = startDate
        ? format(startDate, "yyyy-MM-dd")
        : "";
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : "";
      form.setValue("startDate", formattedStartDate);
      form.setValue("endDate", formattedEndDate);
    } else {
      setDate(undefined);
      form.setValue("startDate", "");
      form.setValue("endDate", "");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Tournament Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <div
                      className={field.value ? "" : "text-muted-foreground"}
                    >
                      <SelectValue
                        placeholder="Select Tournament Status"
                        {...field}
                      />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Registration Closed">
                    Registration Closed
                  </SelectItem>
                  <SelectItem value="Enrollment Open">
                    Enrollment Open
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date range picker */}
        <FormField
          control={form.control}
          name="startDate"
          render={() => (
            <FormItem className="flex flex-col flex-grow">
              <FormLabel>Date Range</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger className="flex flex-col flex-grow">
                  <FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "pl-3 w-full text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={handleDateChange}
                    numberOfMonths={2}
                    min={2}
                    className="flex flex-col flex-grow"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
