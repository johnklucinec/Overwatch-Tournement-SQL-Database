"use client";

import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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

/* API Route to populate the TEAMS table */
const TEAMS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/`;

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
      })
      .optional()
      .or(z.literal("")),
    date: z
      .string()
      .min(2, {
        message: "Team Name must be at least 2 characters.",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.name || data.date, {
    message: "Either Team Name or Date must be entered",
    path: ["name"], // specify the field to attach the error to
  })
  .refine((data) => data.name || data.date, {
    message: "Either Team Name or Date must be entered",
    path: ["date"], // specify the field to attach the error to
  });

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
    date: string;
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
 * Function to edit the team's name.
 */
async function editTeam(name: string, date: string) {
  const response = await fetch(TEAMS_API_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, date }),
  });

  return response;
}

export default function CreateTeamsInputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      date: "",
    },
  });

  // Formats the dates to yyyy-MM-dd
  function formatDate(data: z.infer<typeof FormSchema>) {
    if (data.date) {
      data.date = new Date(data.date).toISOString().split("T")[0];
    }
  }

  // Process the "Submit" button
  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      formatDate(data);

      const response = await editTeam(data.name ?? "", data.date ?? "");

      // Sends the response and data to be processed
      const result = processResponse(response, {
        name: data.name ?? "",
        date: data.date ?? "",
      });

      // Reset the form after submission, if the response is ok.
      form.reset({
        name: "",
        date: "",
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Team Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col flex-grow">
              <FormLabel>Team Formation Date</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger className="flex flex-col flex-grow">
                  <FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "pl-3 w-full text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date.toISOString());
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
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
