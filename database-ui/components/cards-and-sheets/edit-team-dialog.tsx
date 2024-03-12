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
import EditTeamForm from "@/components/forms/edit-team-form";


// Makes typescript not complain for some reason.
interface EditTeamDialogProps {
  onClose: () => Promise<void>;
}

const EditTeamDialog: React.FC<EditTeamDialogProps> = ({ onClose }) => {
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
          Edit Team
        </Button>
      </DialogTrigger>

      {/* Adds Dialog title, description, and form */}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>Edit Team Info Here</DialogDescription>
        </DialogHeader>
        <EditTeamForm />
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamDialog;
