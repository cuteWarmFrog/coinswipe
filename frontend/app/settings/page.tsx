"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBalance } from "wagmi";
import { formatNumber, TELEGRAM_MOCK_ID } from "@/lib/utils";
import { ModeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);

  const { data } = useBalance({
    address: "0xd64a2e1eD2927499ce5A8ac9FbCa3A130BFAa395",
  });

  const {
    data: wallet,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet", TELEGRAM_MOCK_ID],
    queryFn: async () => {
      const response = await fetch(
        `https://coinswipe.pythonanywhere.com/wallet/profile/${TELEGRAM_MOCK_ID}/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const handleCopyClick = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="relative">
        <h1 className="text-2xl text-center font-bold mb-4">Settings</h1>
        <div className="absolute top-0 right-2">
          <ModeToggle />
        </div>
      </div>
      <main className="flex-grow mt-4 items-center flex flex-col">
        {isLoading && <div>Loading...</div>}
        {wallet && !isLoading && (
          <Card className="w-full max-w-md p-6 grid gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                  <CoinsIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {data && `${formatNumber(data?.formatted)} ${data.symbol}`}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Current Balance
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground text-sm">
                  {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 relative"
                  onClick={handleCopyClick}
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                  {copied && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                      Copied!
                    </span>
                  )}
                </Button>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">
              Feel free to send some SEI here :)
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

function CoinsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}

function CopyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
