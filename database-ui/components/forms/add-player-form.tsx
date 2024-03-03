"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

/**
 * Schema to check for user error
 */
const FormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(20),
  email: z.string().email({
    message: "Invalid email address.",
  }),
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
  data: { username: string; email: string; }
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
   showSubmissionToast(data, { message: "Error parsing response body", status: response.status });
   return;
  }
  
  showSubmissionToast(data, { message, status: response.status });

  // Here for testing purposes. 
  await addDefaultRole(data.username, "DPS", "Diamond", "3");
  
  return result;
  
}

/**
 * Function to add a default role to the player. 
 */
async function addDefaultRole(username: string, role: string, rankName: string, rankDivision: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/playerroles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, role, rankName, rankDivision }),
  });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
}

export default function CreatePlayerInputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/players/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    const result = processResponse(response, data)

    return result;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                This is the player's display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} />
              </FormControl>
              <FormDescription>
                This is the player's email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
