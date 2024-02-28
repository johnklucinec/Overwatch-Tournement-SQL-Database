"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
 Card,
 CardContent,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CardWithForm() {
 const [showCard, setShowCard] = useState(false);
 const [animation, setAnimation] = useState(false);

 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
 const [roles, setRoles] = useState({
    tank: { selected: false, rank: "", division: "" },
    dps: { selected: false, rank: "", division: "" },
    support: { selected: false, rank: "", division: "" },
 });

 // Handle input changes
 const handleInputChange = (event: { target: any }) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (target.type !== "checkbox") {
      if (name === "name") setName(value);
      if (name === "email") setEmail(value);
    }
 };

 // Handle checkbox changes
 const handleCheckboxChange = (role: string) => {
    setRoles({
      ...roles,
      [role]: {
        ...roles[role as keyof typeof roles],
        selected: !roles[role as keyof typeof roles].selected,
      },
    });
 };

 // Handle select changes
 const handleSelectChange = (role: string, field: string, value: string) => {
    setRoles({
      ...roles,
      [role]: { ...roles[role as keyof typeof roles], [field]: value },
    });
 };

 // Handle form submit
 const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Run your function here using the state values
    console.log(name, email, roles);
 };

 const toggleCardVisibility = () => {
    setAnimation(!animation);
    setTimeout(() => {
      setShowCard(!showCard);
    }, 200);
 };

 const ranks = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Grandmaster",
    "Champion",
 ];
 const divisions = [1, 2, 3, 4, 5];

 const RankMenu = ({ role }: DivisionMenuProps) => {
    return (
      <div className="flex flex-col space-y-1.5 flex-1 mr-2">
        <Label htmlFor="rank">Rank</Label>
        <Select>
          <SelectTrigger id={`${role}-rank`}>
            <SelectValue placeholder={roles[role as keyof typeof roles].rank || "Rank"} />
          </SelectTrigger>
          <SelectContent position="popper">
            {ranks.map((rank, index) => (
              <SelectItem
                key={index}
                value={rank}
                onClick={() => handleSelectChange(role, "rank", rank)}
              >
                {rank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
 };

 type DivisionMenuProps = {
    role: string;
 };

 const DivisionMenu = ({ role }: DivisionMenuProps) => {
    return (
      <div className="flex flex-col space-y-1.5 flex-3 mr-2">
        <Label htmlFor="division">Division</Label>
        <Select>
          <SelectTrigger id={`${role}-division`}>
            <SelectValue placeholder={roles[role as keyof typeof roles].division || "Division"} />
          </SelectTrigger>
          <SelectContent position="popper">
            {divisions.map((division, index) => (
              <SelectItem
                key={index}
                value={String(division)}
                onClick={() =>
                 handleSelectChange(role, "division", String(division))
                }
              >
                {division}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
 };

 type RankAndDivisionProps = {
    role: string;
 };

 const RankAndDivision = ({ role }: RankAndDivisionProps) => {
    return (
      <div className="flex">
        <RankMenu role={role} />
        <DivisionMenu role={role} />
      </div>
    );
 };

 return (
    <div>
      {/* Button to trigger the card visibility */}
      <Button
        className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary-background bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs h-8 border-solid text-primary-background"
        onClick={toggleCardVisibility}
      >
        Add Player
      </Button>

      {/* Overlay container for the card */}
      {showCard && (
        <div
          data-state={animation ? "open" : "closed"}
          className="fixed items-center justify-center left-[50vw] top-[40%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-top-1/2 sm:rounded-lg"
        >
          {/* Actual card */}
          <Card className="w-[450px]">
            <CardHeader>
              <CardTitle>Create Player</CardTitle>
              <CardDescription>Create a New Player</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Form content */}
                <div className="grid items-center gap-4">
                 <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Player's Name"
                      value={name}
                      onChange={handleInputChange}
                    />
                 </div>
                 <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Player's Email"
                      value={email}
                      onChange={handleInputChange}
                    />
                 </div>
                 <div className="flex flex-col space-y-1.5">
                    <Label>Role</Label>
                    {["tank", "dps", "support"].map((role) => (
                      <div
                        key={role}
                        className="flex flex-col space-y-1.5 rounded-md border p-2"
                      >
                        <div className="flex items-center">
                          <Checkbox
                            id={role}
                            checked={roles[role as keyof typeof roles].selected}
                            onChange={() => handleCheckboxChange(role)}
                          />
                          <span className="ml-2 text-sm">
                            {role.toUpperCase()}
                          </span>
                        </div>
                        <RankAndDivision role={role} />
                      </div>
                    ))}
                 </div>
                </div>
                {/* Edit the functions of the buttons*/}
                <CardFooter className="flex justify-between ml-2">
                 <Button variant="outline" onClick={toggleCardVisibility}>
                    Cancel
                 </Button>
                 <Button type="submit">Add Player</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
 );
}
