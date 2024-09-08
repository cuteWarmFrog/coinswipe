import React from "react";
import { MatchList } from "@/components/matches";

const matchesMOCK = [
  {
    name: "John Doe",
    image: "https://github.com/shadcn.png",
  },
  {
    name: "Jane Smith",
    image: "https://github.com/shadcn.png",
  },
  {
    name: "Alice Johnson",
    image: "https://github.com/shadcn.png",
  },
  {
    name: "Bob Williams",
    image: "https://github.com/shadcn.png",
  },
];

export default function MatchesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <h1 className="text-2xl text-center font-bold mb-4">Matches</h1>
        <MatchList matches={matchesMOCK} />
      </main>
    </div>
  );
}
