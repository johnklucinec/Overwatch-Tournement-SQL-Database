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
import AddRankForm from "@/components/forms/add-rank-form";


// Makes typescript not complain for some reason.
interface AddRankDialogProps {
  onClose: () => Promise<void>;
}

const AddRankDialog: React.FC<AddRankDialogProps> = ({ onClose }) => {
  // Refresh the table when the dialog is opened or closed.
  // Ideally this should only run when closed, but thats not possible.
  const handleClose = () => {
    onClose().catch((e) => {
      console.error("An error occurred while fetching the rank data.", e);
    });
  };

  return (
    <Dialog onOpenChange={handleClose}>
      {/* Create button for add-rank-dialog */}
      <DialogTrigger asChild>
        <Button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background">
          Add Rank
        </Button>
      </DialogTrigger>

      {/* Adds Dialog title, description, and form */}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Rank</DialogTitle>
          <DialogDescription>Add Rank Info Here</DialogDescription>
        </DialogHeader>
        <AddRankForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddRankDialog;
