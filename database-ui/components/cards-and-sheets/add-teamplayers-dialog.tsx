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
import AddTeamPlayersForm from "@/components/forms/add-teamplayers-form";


// Makes typescript not complain for some reason.
interface AddTeamPlayersDialogProps {
  onClose: () => Promise<void>,
  id: string,
  refreshTable: () => Promise<void>,
}

const AddTeamPlayersDialog: React.FC<AddTeamPlayersDialogProps> = ({ onClose, id, refreshTable }) => {
  // Refresh the table when the dialog is opened or closed.
  // Ideally this should only run when closed, but thats not possible.
  const handleClose = () => {
    onClose().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });

    refreshTable().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });
    
  };

  return (
    <Dialog onOpenChange={handleClose}>
      {/* Create button for edit-teamplayers-dialog */}
      <DialogTrigger asChild>
        <Button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background">
          Add Players
        </Button>
      </DialogTrigger>

      {/* Adds Dialog title, description, and form */}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Team Players</DialogTitle>
          <DialogDescription>Add Players To The Team Here</DialogDescription>
        </DialogHeader>
        <AddTeamPlayersForm id={id}/>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamPlayersDialog;
