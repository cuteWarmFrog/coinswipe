import React from "react";
import NavBar from "@/components/nav-bar";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Positions } from "@/components/positions";

const mockPositions = [
  {
    token: "Bitcoin",
    symbol: "BTC",
    amount: 0.5,
    price: 50000,
    profitLoss: 5000,
  },
  {
    token: "Ethereum",
    symbol: "ETH",
    amount: 2,
    price: 2500,
    profitLoss: -500,
  },
  { token: "Solana", symbol: "SOL", amount: 10, price: 35, profitLoss: 150 },
  { token: "Chainlink", symbol: "LINK", amount: 25, price: 8, profitLoss: -50 },
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <div className="flex justify-center">
          <h1 className="text-2xl text-center font-bold mb-4">Profile</h1>{" "}
          <div className="absolute right-4">
            <ModeToggle />
          </div>
        </div>
        <Positions positions={mockPositions} />
      </main>
      <NavBar />
    </div>
  );
}
