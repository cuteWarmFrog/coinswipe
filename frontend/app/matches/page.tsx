import React from "react";
import NavBar from "@/components/nav-bar";

export default function MatchesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Matches</h1>
        {/* Add your matches content here */}
      </main>
      <NavBar />
    </div>
  );
}