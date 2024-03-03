"use client";

import * as React from "react";
import { useEffect } from "react";
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
  id: z.string(),
  username: z.string().max(20).optional(),
  email: z.string().optional(),
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
    id: string;
    username?: string | undefined;
    email?: string | undefined;
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
   showSubmissionToast(data, { message: "Error parsing response body", status: response.status });
   return;
  }
  
  showSubmissionToast(data, { message, status: response.status });
  return result;
  
}

export default function EditPlayerInputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      form.setValue("id", id);
    }
  }, [form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.username && !data.email) {
      toast({
        title: "Error",
        description: "Please provide at least a username or an email.",
      });
      return;
    }

    // Create a new object to send as the body of the request
    const requestBody = {
      id: data.id,
      ...(data.username && { username: data.username }),
      ...(data.email && { email: data.email }),
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/players/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    return processResponse(response, data);
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
