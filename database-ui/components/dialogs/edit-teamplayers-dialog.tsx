"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Form that this dialog uses
import EditTeamPlayersForm from "@/components/forms/edit-teamplayers-form";

export type Player = {
  id: string;
  name: string;
  roles: string[];
};

// Makes typescript not complain for some reason.
interface EditTeamPlayersDialogProps {
  onClose: () => Promise<void>;
  id: string;
  data: Player[];
  refreshTable: () => Promise<void>;
}

const EditTeamPlayersDialog: React.FC<EditTeamPlayersDialogProps> = ({ onClose, id, data, refreshTable }) => {
  // Refresh the table when the dialog is opened or closed.
  // Ideally this should only run when closed, but thats not possible.
  const handleClose = () => {
    onClose().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });
  };

  return (
    <Dialog onOpenChange={handleClose}>
      {/* Create button for edit-team-dialog */}
      <DialogTrigger asChild>
        <Button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background">
          Edit Players
        </Button>
      </DialogTrigger>

      {/* Adds Dialog title, description, and form */}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Team Players</DialogTitle>
          <DialogDescription>Edit The Player Roles Here</DialogDescription>
        </DialogHeader>
        <EditTeamPlayersForm id={id} data={data} refreshData={refreshTable }/>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamPlayersDialog;
