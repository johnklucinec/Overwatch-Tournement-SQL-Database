"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import RankRole from "@/components/forms/edit-playerroles";

/* API Route to populate the PlayerRoles table */
const PLAYERROLES_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/playerroles/`;

/**
 * Schema to check for user error
 * At the time of making this, zod does not have conditional validation.
 * You can use .refine to get a similar effect, but its not pretty.
 */
export const FormSchema = z
  .object({
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

type PlayerRole = {
  id: string;
  rank: string;
  role: string;
};

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
    tankRank?: string;
    tankDivision?: string;
    dpsRank?: string;
    dpsDivision?: string;
    supportRank?: string;
    supportDivision?: string;
  }
) {
  let message = "Roles Updated";
  let result;

  try {
    result = await response.json();
    message = result.message || "Unknown error";
    if (!response.ok) {
      console.error("Error parsing response body:", message);
      showSubmissionToast(data, {
        message: "Error parsing response body: ",
        status: response.status,
      });
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
 * Function to add a role (Rank and Divison) to the player.
 * Uses their username, since this runs when the add player query runs.
 */
async function updatePlayerRole(
  id: string,
  role: string,
  rankName: string,
  rankDivision: string
) {
  const response = await fetch(PLAYERROLES_API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, role, rankName, rankDivision }),
  });

  return response;
}

async function addPlayerRole(
  id: string,
  role: string,
  rankName: string,
  rankDivision: string
) {
  const response = await fetch(PLAYERROLES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, role, rankName, rankDivision }),
  });

  return response;
}

async function deletePlayerRole(id: string, role: string) {
  const response = await fetch(PLAYERROLES_API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, role: role.toUpperCase() }),
  });

  return response;
}

/**
 * Function to add a role (Rank and Divison) to the player.
 * Uses their username, since this runs when the add player query runs.
 */
async function playerRoleManager(
  id: string,
  formData: z.infer<typeof FormSchema>,
  lowerCaseRoleData: string[]
) {
  const TANK_ROLE = "TANK";
  const DPS_ROLE = "DPS";
  const SUPPORT_ROLE = "SUPPORT";

  const roles = [TANK_ROLE, DPS_ROLE, SUPPORT_ROLE];

  let lastResponse;

  for (const role of roles) {
    const division =
      formData[`${role.toLowerCase()}Division` as keyof typeof formData];
    const rank =
      formData[`${role.toLowerCase()}Rank` as keyof typeof formData];

    if (division && rank) {
      if (lowerCaseRoleData.includes(role.toLowerCase())) {
        lastResponse = updatePlayerRole(id, role, rank, division);
      } else {
        lastResponse = addPlayerRole(id, role, rank, division);
      }
    } else if (lowerCaseRoleData.includes(role.toLowerCase())) {
      lastResponse = deletePlayerRole(id, role);
    }
  }

  if (lastResponse) {
    const response = await lastResponse;
    processResponse(response, formData);
  }
  return;
}

interface EditPlayerInputFormProps {
  id: string;
  data: PlayerRole[];
}

export default function EditPlayerInputForm({
  id,
  data,
}: EditPlayerInputFormProps) {
  const [showRoles, setShowRoles] = useState({
    tank: false,
    dps: false,
    support: false,
  });

  const lowerCaseRoleData = data.map((roleObj) => roleObj.role.toLowerCase());

  // Check if each role is present in roleData
  const [hasRoles, setHasRoles] = useState({
    tank: lowerCaseRoleData.includes("tank"),
    dps: lowerCaseRoleData.includes("dps"),
    support: lowerCaseRoleData.includes("support"),
  });

  // Gives each varible a default value
  // Allows only one role to be selected during a query
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tankRank: "",
      tankDivision: "",
      dpsRank: "",
      dpsDivision: "",
      supportRank: "",
      supportDivision: "",
    },
  });

  // Autofills the roles if the player has them
  useEffect(() => {
    setRoleMapping(data, setShowRoles);
  }, [data]);

  // Show a RankRole form when its accompanying toggle is toggled
  const handleToggle = (role: string) => {
    handleToggleHelper(role, form, showRoles, setHasRoles, setShowRoles);
  };

  // Set the form values based on the data and form props.
  useEffect(() => {
    setFormValues(data, form);
  }, [data, form]);

  // Proccess the "Sumbit" button
  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    // Make sure at least one toggle button is active
    // Also, make sure both a Rank and Division is selected
    if (
      (showRoles.tank &&
        hasRoles.tank &&
        (!formData.tankRank || !formData.tankDivision)) ||
      (showRoles.dps &&
        hasRoles.dps &&
        (!formData.dpsRank || !formData.dpsDivision)) ||
      (showRoles.support &&
        hasRoles.support &&
        (!formData.supportRank || !formData.supportDivision)) ||
      !(showRoles.tank || showRoles.dps || showRoles.support)
    ) {
      toast({
        title: "Error",
        description: "Please select a Rank and a Role",
      });

      return;
    }

    playerRoleManager(id, formData, lowerCaseRoleData);

    return;
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
        <>
          <ToggleGroup variant="outline" type="multiple">
            <ToggleGroupItem
              value="Tank"
              aria-label="Toggle Tank"
              onClick={() => handleToggle("Tank")}
              data-state={showRoles.tank ? "on" : "off"}
              className={
                !(showRoles.tank || showRoles.dps || showRoles.support)
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
              data-state={showRoles.dps ? "on" : "off"}
              className={
                !(showRoles.tank || showRoles.dps || showRoles.support)
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
              data-state={showRoles.support ? "on" : "off"}
              className={
                !(showRoles.tank || showRoles.dps || showRoles.support)
                  ? "text-destructive"
                  : ""
              }
            >
              SUPPORT
            </ToggleGroupItem>
          </ToggleGroup>

          {!(showRoles.tank || showRoles.dps || showRoles.support) && (
            <div className="text-sm font-medium text-destructive">
              At least one role must be selected
            </div>
          )}

          {showRoles.tank && <RankRole form={form} playerRole="Tank" />}
          {showRoles.dps && <RankRole form={form} playerRole="Dps" />}
          {showRoles.support && <RankRole form={form} playerRole="Support" />}
        </>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

/* I Moved these down here because they were ugly and I did not want to look at them */

/**
 * Sets the form values for player roles.
 *
 * @param {PlayerRole[]} data - The player roles data.
 * @param {any} form - The form object from react-hook-form.
 * @returns {void}
 */
export const setFormValues = (data: PlayerRole[], form: any) => {
  data.forEach((playerRole: PlayerRole) => {
    const { role, rank } = playerRole;
    const [rankName, rankDivision] = rank.split(" ");

    switch (role.toLowerCase()) {
      case "tank":
        form.setValue("tankRank", rankName);
        form.setValue("tankDivision", rankDivision);
        break;
      case "dps":
        form.setValue("dpsRank", rankName);
        form.setValue("dpsDivision", rankDivision);
        break;
      case "support":
        form.setValue("supportRank", rankName);
        form.setValue("supportDivision", rankDivision);
        break;
      default:
        break;
    }
  });
};

/**
 * Sets the role mapping based on the provided data array and updates the showRoles state.
 *
 * @param {PlayerRole[]} data - The array of player roles.
 * @param {function} setShowRoles - The function to update the showRoles state.
 * @returns {void}
 */
export const setRoleMapping = (data: PlayerRole[], setShowRoles: any) => {
  const roleMapping: { [key: string]: () => void } = {
    TANK: () =>
      setShowRoles((prevState: any) => ({ ...prevState, tank: true })),
    DPS: () => setShowRoles((prevState: any) => ({ ...prevState, dps: true })),
    SUPPORT: () =>
      setShowRoles((prevState: any) => ({ ...prevState, support: true })),
  };

  data.forEach((playerRole: PlayerRole) => {
    const { role } = playerRole;
    if (roleMapping[role.toUpperCase()]) {
      roleMapping[role.toUpperCase()]();
    }
  });
};

/**
 * Handles the toggle functionality for the given role.
 *
 * @param {string} role - The role to handle the toggle for.
 * @param {any} form - The form object from react-hook-form.
 * @param {any} showRoles - The object containing the current show/hide state of roles.
 * @param {any} setHasRoles - The function to update the hasRoles state.
 * @param {any} setShowRoles - The function to update the showRoles state.
 * @returns {void}
 */
export const handleToggleHelper = (
  role: string,
  form: any,
  showRoles: any,
  setHasRoles: any,
  setShowRoles: any
) => {
  switch (role) {
    case "Tank":
      if (showRoles.tank) {
        form.setValue("tankRank", "");
        form.setValue("tankDivision", "");
        setHasRoles((prevState: any) => ({ ...prevState, tank: false }));
      }
      setShowRoles((prevState: any) => ({
        ...prevState,
        tank: !prevState.tank,
      }));
      break;
    case "Dps":
      if (showRoles.dps) {
        form.setValue("dpsRank", "");
        form.setValue("dpsDivision", "");
        setHasRoles((prevState: any) => ({ ...prevState, dps: false }));
      }
      setShowRoles((prevState: any) => ({
        ...prevState,
        dps: !prevState.dps,
      }));
      break;
    case "Support":
      if (showRoles.support) {
        form.setValue("supportRank", "");
        form.setValue("supportDivision", "");
        setHasRoles((prevState: any) => ({ ...prevState, support: false }));
      }
      setShowRoles((prevState: any) => ({
        ...prevState,
        support: !prevState.support,
      }));
      break;
    default:
      break;
  }
};
