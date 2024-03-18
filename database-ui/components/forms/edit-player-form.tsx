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

/* API Route to populate the Players table */
const PLAYERS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/players/`;

/**
 * Schema to check for user error
 */
const FormSchema = z.object({
  id: z.string(),
  username: z.string().max(20).optional(),
  email: z.string().optional(),
})
.refine(data => data.username || data.email, {
  message: "Either username or email must be entered",
  path: ['username'] // specify the field to attach the error to
})
.refine(data => data.username || data.email, {
  message: "Either username or email must be entered",
  path: ['email'] // specify the field to attach the error to
}).refine(data => {
  if ((data.email ?? "") !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) {
    return false; // return false if email is not valid
  }
  return true; // return true otherwise
}, {
  message: "Invalid email format",
  path: ['email']
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
  
  // Display the data the user submitted in a toast popup.
  /*
   * @param data - The data submitted by the user.
   * @param message - Error message from fetch APIs or above
   * @param status - Contains status code from fetch APIs
   */
  showSubmissionToast(data, { message, status: response.status });

  return result;
  
}

interface EditPlayerInputFormProps {
  id: string;
}

export default function EditPlayerInputForm({id}: EditPlayerInputFormProps) {
 
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (id) {
      form.setValue("id", id);
    }
  }, [form, id]);

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
      PLAYERS_API_URL,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Reset le form
    form.reset({
        id: id,
        username: "",
        email: "",
    });
        
    return processResponse(response, data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit((formData) => onSubmit(formData))();
        }}
        className="space-y-2"
      >
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
