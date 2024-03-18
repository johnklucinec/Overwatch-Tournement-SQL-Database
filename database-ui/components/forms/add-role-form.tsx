"use client";

import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

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
const ROLES_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/roles/`;

/**
 * Schema to check for user error
 */
export const FormSchema = z.object({
  role: z
    .string()
    .min(2, {
      message: "Please Select a Role.",
    })
    .max(20, {
      message: "INVALID ROLE",
    }),
});

/**
 * All the Available Roles
 */
const availableRoles = [
  { label: "TANK", value: "TANK" },
  { label: "DPS", value: "DPS" },
  { label: "SUPPORT", value: "SUPPORT" },
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
    role: string;
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
 * Function to add the Role
 */
async function addRole(role: string) {
  const response = await fetch(ROLES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  return response;
}

export default function CreateRolesInputForm() {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Process the "Submit" button
  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      const response = await addRole(data.role);

      // Sends the response and data to be processed
      const result = processResponse(response, { role: data.role });

      // Reset the form after submission, if the response is ok.
      form.reset({
        role: "",
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
          name="role"
          render={({ field }) => (
            <FormItem className="flex flex-col flex-grow">
              <FormLabel>Role</FormLabel>
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
                        ? availableRoles.find(
                            (role) => role.value === field.value
                          )?.label
                        : "Select role"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search role..." />
                    <CommandEmpty>No role found.</CommandEmpty>
                    <CommandGroup>
                      {availableRoles.map((role) => (
                        <CommandItem
                          value={role.label}
                          key={role.value}
                          onSelect={() => {
                            form.setValue("role", role.value);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              role.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {role.label}
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
