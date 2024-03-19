"use client";

import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* API Route to populate the TOURNAMENTS table */
const TOURNAMENTS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/tournaments/`;

/**
 * Schema to check for user error
 */
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
    status: z
      .string()
      .min(2, {
        message: "Status must be at least 2 characters.",
      })
      .optional()
      .or(z.literal("")),
    startDate: z
      .string()
      .min(2, {
        message: "Start Date must be at least 2 characters.",
      })
      .optional()
      .or(z.literal("")),
    endDate: z
      .string()
      .min(2, {
        message: "End Date must be at least 2 characters.",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => data.name || data.startDate || data.endDate || data.status,
    {
      message: "Please Change at Least One Thing",
      path: ["name"],
    }
  )
  .refine(
    (data) => data.name || data.startDate || data.endDate || data.status,
    {
      message: "Please Change at Least One Thing",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => data.name || data.startDate || data.endDate || data.status,
    {
      message: "Please Change at Least One Thing",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => data.name || data.startDate || data.endDate || data.status,
    {
      message: "Please Change at Least One Thing",
      path: ["status"],
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
 * Function to edit the tournament info
 */
async function editTournament(
  id: string,
  name: string,
  status: string,
  startDate: string,
  endDate: string
) {
  const body: { id: string, name?: string, status?: string, startDate?: string, endDate?: string } = { id };

  if (name !== "") {
    body.name = name;
  }

  if (status !== "") {
    body.status = status;
  }

  if (startDate !== "") {
    body.startDate = startDate;
  }

  if (endDate !== "") {
    body.endDate = endDate;
  }

  const response = await fetch(TOURNAMENTS_API_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
}

export default function CreateTeamsInputForm({ id }: { id: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      status: "",
      startDate: "",
      endDate: "",
    },
  });

  // Formats the dates to yyyy-MM-dd
  function formatDate(data: z.infer<typeof FormSchema>) {
    if (data.startDate) {
      data.startDate = new Date(data.startDate).toISOString().split("T")[0];
    }

    if (data.endDate) {
      data.endDate = new Date(data.endDate).toISOString().split("T")[0];
    }
  }

  // Process the "Submit" button
  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      formatDate(data);

      const response = await editTournament(
        id,
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

      // Reset the form after submission, if the response is ok.
      form.reset({
        name: "",
        status: "",
        startDate: "",
        endDate: "",
      });

      return result;
    },
    [form, id]
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
              <FormMessage className="mb-4" />
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Team Name" {...field} />
              </FormControl>
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
            </FormItem>
          )}
        />

        <DateFormField
          control={form.control}
          name="startDate"
          label="Tournament Start Date"
          placeholder="Pick a start date"
        />
        <DateFormField
          control={form.control}
          name="endDate"
          label="Tournament End Date"
          placeholder="Pick an end date"
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

interface DateFormFieldProps {
  control: Control;
  name: string;
  label: string;
  placeholder: string;
}

const DateFormField: React.FC<DateFormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
}) => {
  return (
    
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col flex-grow">
          <FormLabel>{label}</FormLabel>
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
                    <span>{placeholder}</span>
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
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};
