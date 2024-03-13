"use client";

import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";

import TeamsComboBox from "@/components/teams-combobox";

/* API Route to populate the TEAMS table */
//const TEAMPLAYERS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teamplayers/`;

/**
 * Schema to check for user error
 */
export const FormSchema = z.object({
  team: z.string().min(1, {
    message: "Please Select a Team",
  }),
  name: z.string().optional(),
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
// eslint-disable-next-line no-unused-vars
async function processResponse(
  response: Response,
  data: {
    team: string;
    name: string;
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
/*
async function editTeam(
  id: string,
) {

  const response = await fetch(
    TEAMPLAYERS_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, date }),
    }
  );

  return response;
}
*/

export type Team = {
  id: string;
  name: string;
};

export default function CreateTeamsInputForm({ id }: { id: string }) {
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [resetForm, setResetForm] = useState(false);



  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      team: "",
      name: "",
    },
  });

  const handleTeamSelect = useCallback(
    (selectedTeam: Team) => {
      if (selectedTeam.id !== selectedTeamId) {
        setSelectedTeamId(selectedTeam.id);
        form.setValue("team", selectedTeam.id.toString());
        form.setValue("name", selectedTeam.name);
      }
    },
    [form, selectedTeamId]
  );


  // Proccess the "Sumbit" button
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    //const response = await addTeam(data.name, data.date)

    // Sends the response and data to be processed
    //const result = processResponse(response, data);

    showSubmissionToast(data, { message: "Poggies", status: 200 });

    // Reset the form values
    form.reset({
      team: "",
      name: "",
    });

    setResetForm(true);

    //return result;
    return;
  }

  useEffect(() => {
    if (resetForm) {
      setResetForm(false);
    }
  }, [resetForm]);

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="space-y-2"
      >
        <TeamsComboBox
          id={id}
          onTeamSelect={handleTeamSelect}
          reset={resetForm}
        />
  
  
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}