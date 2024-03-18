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
import AddTournamentForm from "@/components/forms/edit-tournament-form";

// Makes typescript not complain for some reason.
interface AddTournamentDialogProps {
  onClose: () => Promise<void>;
<<<<<<< HEAD
  id: string;
}

const AddTournamentDialog: React.FC<AddTournamentDialogProps> = ({ onClose, id }) => {
=======
}

const AddTournamentDialog: React.FC<AddTournamentDialogProps> = ({ onClose }) => {
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
  // Refresh the table when the dialog is opened or closed.
  // Ideally this should only run when closed, but thats not possible.
  const handleClose = () => {
    onClose().catch((e) => {
      console.error("An error occurred while fetching the tournament data.", e);
    });
  };

  return (
    <Dialog onOpenChange={handleClose}>
      {/* Create button for add-tournament-dialog */}
      <DialogTrigger asChild>
        <Button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background">
          Edit Tournament
        </Button>
      </DialogTrigger>

      {/* Adds Dialog title, description, and form */}
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit Tournament</DialogTitle>
          <DialogDescription>Edit Tournament Info Here</DialogDescription>
        </DialogHeader>
<<<<<<< HEAD
        <AddTournamentForm id={id}/>
=======
        <AddTournamentForm />
>>>>>>> 13da8d50fc441fa30f405a4b5cdd66f50c114660
      </DialogContent>
    </Dialog>
  );
};

export default AddTournamentDialog;
