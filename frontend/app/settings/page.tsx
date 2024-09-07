import React from "react";
import NavBar from "@/components/nav-bar";
import { ModeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1> <ModeToggle />
        {/* Add your matches content here */}
      </main>
      <NavBar />
    </div>
  );
}
