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
import AddTournamentTeamsForm from "@/components/forms/add-tournamentteams-form";


// Makes typescript not complain for some reason.
interface AddTournamentTeamsDialogProps {
  onClose: () => Promise<void>,
  id: string,
}

const AddTournamentTeamsDialog: React.FC<AddTournamentTeamsDialogProps> = ({ onClose, id }) => {
  // Refresh the table when the dialog is opened or closed.
  // Ideally this should only run when closed, but thats not possible.
  const handleClose = () => {
    onClose().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });
  };

  return (
    <Dialog onOpenChange={handleClose}>
      {/* Create button for add-tournamentteams-dialog */}
      <DialogTrigger asChild>
        <Button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background">
          Add Team
        </Button>
      </DialogTrigger>

      {/* Adds Dialog title, description, and form */}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Tournament Teams</DialogTitle>
          <DialogDescription>Add Teams To The Tournament Here</DialogDescription>
        </DialogHeader>
        <AddTournamentTeamsForm id={id}/>
      </DialogContent>
    </Dialog>
  );
};

export default AddTournamentTeamsDialog;
