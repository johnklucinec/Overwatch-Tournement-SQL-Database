import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import React from 'react';

import DatePickerWithRange from "@/components/date-picker"


export default function EditSheet() {
  

  return (
    <Sheet>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent side={"left"}>

      <div className="grid gap-4 py-4">
        <SheetHeader>
          <SheetTitle className="items-left gap-4">Edit Tournament</SheetTitle>
          <SheetDescription className="items-left gap-4">
            Add the name, start date, and end data of the tournament here. Click "Edit tournament" when you're done.
          </SheetDescription>
        </SheetHeader>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-left gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input id="tournament-name" className="grid-cols-2" />
          </div>

          <div className="grid grid-cols-1 items-left gap-4">
            <Label htmlFor="Date" className="text-left">  
              Date
            </Label>
            <DatePickerWithRange id="tournament-date"/>
          </div>

        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Edit tournament</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}