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
import EditPlayerForm from "@/components/forms/edit-player-form";

// Makes typescript not complain for some reason.
interface EditPlayerDialogProps {
  onClose: () => Promise<void>;
  id: string;
}

const EditPlayerDialog: React.FC<EditPlayerDialogProps> = ({ onClose, id }) => {
  const handleClose = React.useCallback(() => {
    onClose().catch((e) => {
      console.error("An error occurred while fetching the players data.", e);
    });
  }, [onClose]);

  return (
    <Dialog onOpenChange={handleClose}>
      {/* Create button for add-player-dialog */}
      <DialogTrigger asChild>
        <Button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background">
          Edit Player
        </Button>
      </DialogTrigger>

      {/* Adds Dialog title, description, and form */}
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
          <DialogDescription>Edit Player Info Here</DialogDescription>
        </DialogHeader>
        <EditPlayerForm id={id}/>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlayerDialog;
