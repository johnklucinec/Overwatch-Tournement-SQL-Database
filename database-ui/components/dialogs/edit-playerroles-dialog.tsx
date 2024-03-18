"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Form that this dialog uses
import EditPlayerRolesForm from "@/components/forms/edit-playerroles-form";

// Create the toggle buttons to dynamically "generate" the form
export function ToggleGroupDemo() {
  return (
    <ToggleGroup variant="outline" type="multiple">
      <ToggleGroupItem value="TANK">TANK</ToggleGroupItem>
      <ToggleGroupItem value="DPS">DPS</ToggleGroupItem>
      <ToggleGroupItem value="SUPPORT">SUPPORT</ToggleGroupItem>
    </ToggleGroup>
  );
}

type PlayerRole = {
  id: string;
  rank: string;
  role: string;
};

// Makes typescript not complain for some reason.
interface EditPlayerRolesDialogProps {
  onClose: () => [Promise<void>, Promise<void>];
  id: string;
  data: PlayerRole[];
}

const EditPlayerRolesDialog: React.FC<EditPlayerRolesDialogProps> = ({ onClose, id, data }) => {
  // Refresh the table when the dialog is opened or closed.
  // Ideally this should only run when closed, but thats not possible.
  const handleClose = async () => {
    try {
      await onClose();
    } catch (e) {
      console.error("An error occurred while fetching the players data.", e);
    }
  };

  return (
    <Dialog onOpenChange={handleClose}>
      {/* Create button for add-player-dialog */}
      <DialogTrigger asChild>
        <Button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background">
          Edit Roles
        </Button>
      </DialogTrigger>

      {/* Adds Dialog title, description, and form */}
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit Roles</DialogTitle>
          <DialogDescription>Edit Player Roles Here</DialogDescription>
        </DialogHeader>
        <EditPlayerRolesForm id={id} data={data} />
      </DialogContent>
    </Dialog>
  );
};

export default EditPlayerRolesDialog;
