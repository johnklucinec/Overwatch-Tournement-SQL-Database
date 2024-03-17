"use client";

import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import PlayersComboBox from "@/components/players-combobox";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/* API Route to populate the TEAMS table */
const TEAMPLAYERS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teamplayers/`;

/**
 * Schema to check for user error
 */
export const FormSchema = z.object({
  player: z.string().min(1, {
    message: "Please Select a Player",
  }),
  name: z.string().optional(),
  roles: z.array(z.string()).min(1, {
    message: "Please Select a Role",
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
// eslint-disable-next-line no-unused-vars
async function processResponse(
  response: Response,
  data: {
    player: string;
    name: string;
    roles: string[];
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
 * Function to add a player's roles to a team
 */

async function addTeamPlayerRole(
  teamID: string,
  playerID: string,
  role: string
) {

  const response = await fetch(
    TEAMPLAYERS_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamID, playerID, role }),
    }
  );

  return response;
}

/**
 * Function to remove a player's role from a team
 */

async function deleteTeamPlayerRole(
  teamID: string,
  playerID: string,
  role: string
) {

  const response = await fetch(
    TEAMPLAYERS_API_URL,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamID, playerID, role }),
    }
  );

  return response;
}

async function processRoles(teamID: string, playerID: string, roles: string[], playerName: string, hasRoles: { tank: boolean; dps: boolean; support: boolean; [key: string]: boolean; }) {
  let response;

  const allRoles = ['TANK', 'DPS', 'SUPPORT'];

  for (const role of allRoles) {

    if (roles.includes(role) && !hasRoles[role.toLowerCase()]) {
      try {
        response = await addTeamPlayerRole(teamID, playerID, role);
        if (!response.ok) {
          showSubmissionToast({player: playerID, name: playerName, roles}, { message: "Error occurred while adding role", status: 400 });
          return;
        }
      } catch (e) {
        showSubmissionToast({player: playerID, name: playerName, roles}, { message: "Error occurred while adding role", status: 400 });
        return;
      }
    } else if (!roles.includes(role) && hasRoles[role.toLowerCase()]) {
      try {
        response = await deleteTeamPlayerRole(teamID, playerID, role);
        if (!response.ok) {
          showSubmissionToast({player: playerID, name: playerName, roles}, { message: "Error occurred while deleting role", status: 400 });
          return;
        }
      } catch (e) {
        showSubmissionToast({player: playerID, name: playerName, roles}, { message: "Error occurred while deleting role", status: 400 });
        return;
      }
    }
  }

  if (response) {
    await processResponse(response, { player: playerID, name: playerName, roles });
  }

  return;
}

export type Player = {
  id: string;
  name: string;
  roles: string[];
};

export default function CreateTeamsInputForm({
  id,
  data,
  refreshData,
}: {
  id: string;
  data: Player[];
  refreshData: () => Promise<void>;
}) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [resetForm, setResetForm] = useState(false);

  // Set all toggles to be disabled by
  const [disabled, setDisabled] = useState<{
    tank: boolean;
    dps: boolean;
    support: boolean;
  }>({
    tank: true,
    dps: true,
    support: true,
  });

    // Set all toggles to be disabled by
    const [hasRoles, setHasRoles] = useState<{
      tank: boolean;
      dps: boolean;
      support: boolean;
    }>({
      tank: false,
      dps: false,
      support: false,
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      player: "",
      name: "",
      roles: [],
    },
  });

  const handlePlayerSelect = useCallback(
    (selectedPlayer: Player) => {
      form.setValue("player", selectedPlayer.id.toString());
      form.setValue("name", selectedPlayer.name);

      setDisabled({
        tank: !selectedPlayer.roles.includes("TANK"),
        dps: !selectedPlayer.roles.includes("DPS"),
        support: !selectedPlayer.roles.includes("SUPPORT"),
      });


      // Reset the selected roles
      const player = data.find((player) => player.id === selectedPlayer.id);

      const playerRoles = player
        ? player.roles.map((role) => role.replace(/[{}]/g, "").toUpperCase())
        : [];

      setHasRoles({
          tank: playerRoles.includes("TANK"),
          dps: playerRoles.includes("DPS"),
          support: playerRoles.includes("SUPPORT"),
        });


      form.setValue("roles", playerRoles);
      setSelectedRoles(playerRoles);
    },
    [form, data]
  );


  const toggleRole = (role: string) => {
    setSelectedRoles((prevRoles) => {
      let newRoles;
      if (prevRoles.includes(role)) {
        newRoles = prevRoles.filter((r) => r !== role);
      } else {
        newRoles = [...prevRoles, role];
      }

      // Update the roles field in the form
      form.setValue("roles", newRoles);

      return newRoles;
    });
  };

  // Proccess the "Sumbit" button
  async function onSubmit(data: z.infer<typeof FormSchema>) {

    // Sends the response and data to be processed
    await processRoles(id, data.player, data.roles, data.name ?? "", hasRoles)

    // Reset the form values
    form.reset({
      player: "",
      name: "",
      roles: [],
    });

    refreshData().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });

    // Reset the toggle buttons
    setDisabled({ tank: true, dps: true, support: true });
    setSelectedRoles([]);
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
        <PlayersComboBox
          iid={id}
          onPlayerSelect={handlePlayerSelect}
          reset={resetForm}
        />

        <FormField
          control={form.control}
          name="roles"
          render={() => (
            <>
              <FormLabel>Player's Team Roles: </FormLabel>
              <ToggleGroup
                variant="outline"
                type="multiple"
                className="justify-start"
              >
                <CustomToggleGroupItem
                  value="Tank"
                  label="TANK"
                  disabled={disabled.tank}
                  selected={selectedRoles.includes("TANK")}
                  onClick={() => {
                    toggleRole("TANK");
                  }}
                />
                <CustomToggleGroupItem
                  value="Dps"
                  label="DPS"
                  disabled={disabled.dps}
                  selected={selectedRoles.includes("DPS")}
                  onClick={() => {
                    toggleRole("DPS");
                  }}
                />
                <CustomToggleGroupItem
                  value="Support"
                  label="SUPPORT"
                  disabled={disabled.support}
                  selected={selectedRoles.includes("SUPPORT")}
                  onClick={() => {
                    toggleRole("SUPPORT");
                  }}
                />
              </ToggleGroup>
              <FormMessage />
            </>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function CustomToggleGroupItem({
  value,
  label,
  disabled,
  selected,
  onClick,
}: {
  value: string;
  label: string;
  disabled: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const [isToggled, setIsToggled] = useState(selected);

  useEffect(() => {
    setIsToggled(selected);
  }, [selected]);

  const handleClick = () => {
    if (!disabled) {
      setIsToggled(!isToggled);
      onClick();
    }
  };

  return (
    <ToggleGroupItem
      className="flex-grow"
      value={value}
      aria-label={`Toggle ${label}`}
      disabled={disabled}
      onClick={handleClick}
      data-state={isToggled ? "on" : "off"}
    >
      {label}
    </ToggleGroupItem>
  );
}
