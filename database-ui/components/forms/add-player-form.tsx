"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RankRole from "@/components/forms/add-playerroles-form";

/* API Route to populate the Players table */
const PLAYERS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/players/`;

/* API Route to populate the PlayerRoles table */
const PLAYERROLES_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/playerroles/`

/**
 * Schema to check for user error
 * At the time of making this, zod does not have conditional validation.
 * You can use .refine to get a similar effect, but its not pretty.
 */
export const FormSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(20),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    tankRank: z.string().optional(),
    tankDivision: z.string().optional(),
    dpsRank: z.string().optional(),
    dpsDivision: z.string().optional(),
    supportRank: z.string().optional(),
    supportDivision: z.string().optional(),
  })
  .refine((data) => data.tankRank || !data.tankDivision, {
    message: "Choose a Rank",
    path: ["tankRank"],
  })
  .refine((data) => data.tankDivision || !data.tankRank, {
    message: "Choose a Division",
    path: ["tankDivision"],
  })
  .refine((data) => data.dpsRank || !data.dpsDivision, {
    message: "Choose a Rank",
    path: ["dpsRank"],
  })
  .refine((data) => data.dpsDivision || !data.dpsRank, {
    message: "Choose a Division",
    path: ["dpsDivision"],
  })
  .refine((data) => data.supportRank || !data.supportDivision, {
    message: "Choose a Rank",
    path: ["supportRank"],
  })
  .refine((data) => data.supportDivision || !data.supportRank, {
    message: "Choose a Division",
    path: ["supportDivision"],
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
    username: string;
    email: string;
    tankRank?: string;
    tankDivision?: string;
    dpsRank?: string;
    dpsDivision?: string;
    supportRank?: string;
    supportDivision?: string;
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

  // Even though the form does not let this happen, these checks are in place
  // to make sure an invalid role is not added.
  try {
    if (data.tankRank && data.tankDivision) {
      await addPlayerRole(
        data.username,
        "TANK",
        data.tankRank,
        data.tankDivision
      );
    }
    if (data.dpsRank && data.dpsDivision) {
      await addPlayerRole(
        data.username,
        "DPS",
        data.dpsRank,
        data.dpsDivision
      );
    }
    if (data.supportRank && data.supportDivision) {
      await addPlayerRole(
        data.username,
        "SUPPORT",
        data.supportRank,
        data.supportDivision
      );
    }
  } catch (e) {
    console.error("Error adding roles to player. Deleting player:", e);
    showSubmissionToast(data, {
      message: "Error adding roles to player. Deleting player",
      status: 400,
    });

    // Need to implement player deletion.
    // This basically will never trigger so ill implement it if I have time.
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
 * Function to add a role (Rank and Divison) to the player.
 * Uses their username, since this runs when the add player query runs.
 */
async function addPlayerRole(
  username: string,
  role: string,
  rankName: string,
  rankDivision: string
) {
  const response = await fetch(
    PLAYERROLES_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, role, rankName, rankDivision }),
    }
  );

  return response;
}

export default function CreatePlayerInputForm() {
  // Used for showing and hiding the RankRole forms
  const [showTank, setShowTank] = useState(false);
  const [showDps, setShowDps] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  // Used to check if at least one toggle is toggled
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Show a RankRole form when its accompanying toggle is toggled
  const handleToggle = (role: string) => {
    switch (role) {
      case "Tank":
        setShowTank(!showTank);
        break;
      case "Dps":
        setShowDps(!showDps);
        break;
      case "Support":
        setShowSupport(!showSupport);
        break;
      default:
        break;
    }
  };

  // Gives each varible a default value
  // Allows only one role to be selected during a query
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      tankRank: "",
      tankDivision: "",
      dpsRank: "",
      dpsDivision: "",
      supportRank: "",
      supportDivision: "",
    },
  });

  // Proccess the "Sumbit" button
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Make sure at least one toggle button is active
    // Also, make sure both a Rank and Division is selected
    if (
      (showTank && (!data.tankRank || !data.tankDivision)) ||
      (showDps && (!data.dpsRank || !data.dpsDivision)) ||
      (showSupport && (!data.supportRank || !data.supportDivision))
    ) {
      toast({
        title: "Error",
        description: "Please select a Rank and a Role",
      });
      return;
    }

    // Send the fetch request to create a player
    // This only uses the player name and email
    const response = await fetch(
      PLAYERS_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    // Sends the response and data to be processed
    // This involves adding the roles and creating the toast
    const result = processResponse(response, data);

    // Reset the form after submission
    form.reset({
      username: "",
      email: "",
    });

    // Reset the state of the toggle buttons
    setShowTank(false);
    setShowDps(false);
    setShowSupport(false);

    // Reset the "at least one toggle active" warning
    setIsSubmitted(false);

    return result;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setIsSubmitted(true);
          form.handleSubmit(onSubmit)();
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
              <FormMessage />
            </FormItem>
          )}
        />
        <>
          <ToggleGroup variant="outline" type="multiple">
            <ToggleGroupItem
              value="Tank"
              aria-label="Toggle Tank"
              onClick={() => handleToggle("Tank")}
              data-state={showTank ? "on" : "off"}
              className={
                isSubmitted && !(showTank || showDps || showSupport)
                  ? "text-destructive"
                  : ""
              }
            >
              TANK
            </ToggleGroupItem>
            <ToggleGroupItem
              value="Dps"
              aria-label="Toggle Dps"
              onClick={() => handleToggle("Dps")}
              data-state={showDps ? "on" : "off"}
              className={
                isSubmitted && !(showTank || showDps || showSupport)
                  ? "text-destructive"
                  : ""
              }
            >
              DPS
            </ToggleGroupItem>
            <ToggleGroupItem
              value="Support"
              aria-label="Toggle Support"
              onClick={() => handleToggle("Support")}
              data-state={showSupport ? "on" : "off"}
              className={
                isSubmitted && !(showTank || showDps || showSupport)
                  ? "text-destructive"
                  : ""
              }
            >
              SUPPORT
            </ToggleGroupItem>
          </ToggleGroup>

          {isSubmitted && !(showTank || showDps || showSupport) && (
            <div className="text-sm font-medium text-destructive">
              At least one role must be selected
            </div>
          )}

          {showTank && <RankRole form={form} playerRole="Tank" />}
          {showDps && <RankRole form={form} playerRole="Dps" />}
          {showSupport && <RankRole form={form} playerRole="Support" />}
        </>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
