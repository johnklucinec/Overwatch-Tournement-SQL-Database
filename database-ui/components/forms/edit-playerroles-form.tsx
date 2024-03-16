"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
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
    errorRanks: z.string().optional(),
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
  })
  .refine((data) => data.tankRank || data.dpsRank || data.supportRank, {
    message: "Select And Fill Out At Least One Role",
    path: ["errorRanks"],
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
 * Function to update a role (Rank and Divison) for the player.
 */
async function updatePlayerRole(
  id: string,
  role: string,
  rankName: string,
  rankDivision: string
) {
  const response = await fetch(PLAYERROLES_API_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, role, rankName, rankDivision }),
  });

  return response;
}

/**
 * Function to add a role (Rank and Divison) to the player.
 */
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

/**
 * Function to delete a role (Rank and Divison) from the player.
 */
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
 * Function to determine whether to add, delete, or update a player's role(s)
 * Basically, it compares the formData with the roles the player currently has
 * If the role is present in initial roles, and present in the formData, it updates that role
 * If the role is not present in initial roles, and present in the formData, it adds that role
 * If the role is present in initial roles, and not present in the formData, it deletes that role
 */
async function playerRoleManager(
  id: string,
  formData: z.infer<typeof FormSchema>,
  initialRoles: { [key: string]: boolean }
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
      if (initialRoles[role.toLowerCase()]) {
        // sends update request even if the data is the same :(
        lastResponse = await updatePlayerRole(id, role, rank, division);
      } else {
        lastResponse = await addPlayerRole(id, role, rank, division);
      }
    } else if (initialRoles[role.toLowerCase()]) {
      lastResponse = await deletePlayerRole(id, role);
    }
  }

  // Only captures the response from the last query because less effort. 
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

  // Save the initial roles the player has.
  // This is used later to determine whether to UPDATE, ADD, or DELETE a role.
  const initialRoles = useMemo(() => {
    const roles = {
      tank: false,
      dps: false,
      support: false,
    };

    data.forEach((roleObj) => {
      const role = roleObj.role.toLowerCase() as keyof typeof roles;
      if (role in roles) {
        roles[role] = true;
      }
    });

    return roles;
  }, [data]);

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
    handleToggleHelper(role, form, showRoles, setShowRoles);
  };

  // Set the form values based on the data and form props.
  useEffect(() => {
    setFormValues(data, form);
  }, [data, form]);

  // Proccess the "Sumbit" button
  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    // Remind user if they forgot to fill out a rank.
    if (!validateRoles(showRoles, formData)) {
      return;
    }

    // Sends information to be processed.
    playerRoleManager(id, formData, initialRoles);

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
          <RoleToggleGroup handleToggle={handleToggle} showRoles={showRoles} />

          {/* Send error if at least one role is not toggled */}
          {!(showRoles.tank || showRoles.dps || showRoles.support) && (
            <FormMessage>
              {form.formState.errors.errorRanks &&
                form.formState.errors.errorRanks.message}
            </FormMessage>
          )}

          {/* Send error if both a Rank and Division are not filled out */}
          {((showRoles.tank &&
            (!form.getValues().tankRank || !form.getValues().tankDivision)) ||
            (showRoles.dps &&
              (!form.getValues().dpsRank || !form.getValues().dpsDivision)) ||
            (showRoles.support &&
              (!form.getValues().supportRank ||
                !form.getValues().supportDivision))) && (
            <FormMessage>
              {form.formState.errors.errorRanks &&
                form.formState.errors.errorRanks.message}
            </FormMessage>
          )}

          {/* Role Input Forms */}
          {showRoles.tank && <RankRole form={form} playerRole="Tank" />}
          {showRoles.dps && <RankRole form={form} playerRole="Dps" />}
          {showRoles.support && <RankRole form={form} playerRole="Support" />}
        </>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

interface RoleToggleGroupProps {
  // eslint-disable-next-line no-unused-vars
  handleToggle: (role: string) => void;
  // eslint-disable-next-line no-unused-vars
  showRoles: { [key in "tank" | "dps" | "support"]: boolean };
}

const RoleToggleGroup: React.FC<RoleToggleGroupProps> = ({
  handleToggle,
  showRoles,
}) => {
  const roles = ["Tank", "Dps", "Support"];

  return (
    <ToggleGroup variant="outline" type="multiple">
      {roles.map((role) => (
        <ToggleGroupItem
          key={role}
          value={role}
          aria-label={`Toggle ${role}`}
          onClick={() => handleToggle(role as "tank" | "dps" | "support")}
          data-state={
            showRoles[role.toLowerCase() as keyof typeof showRoles]
              ? "on"
              : "off"
          }
          className={
            !(showRoles.tank || showRoles.dps || showRoles.support)
              ? "flex-grow text-destructive"
              : "flex-grow"
          }
        >
          {role.toUpperCase()}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

/* I Moved these down here because they were ugly and I did not want to look at them */

function validateRoles(
  // eslint-disable-next-line no-unused-vars
  showRoles: { [key in "tank" | "dps" | "support"]: boolean },
  formData: any
) {
  if (
    (showRoles.tank && (!formData.tankRank || !formData.tankDivision)) ||
    (showRoles.dps && (!formData.dpsRank || !formData.dpsDivision)) ||
    (showRoles.support &&
      (!formData.supportRank || !formData.supportDivision)) ||
    !(showRoles.tank || showRoles.dps || showRoles.support)
  ) {
    toast({
      title: "Incomplete Role Information",
      description: "Update or deselect any roles not being added.",
    });

    return false;
  }

  return true;
}

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
  setShowRoles: any
) => {
  switch (role) {
    case "Tank":
      if (showRoles.tank) {
        form.setValue("tankRank", "");
        form.setValue("tankDivision", "");
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
