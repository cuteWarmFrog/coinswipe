"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Positions } from "@/components/positions";
import { useBalance } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { formatNumber, HOST, telegramIdAtom } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtom } from "jotai";


export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [telegramId] = useAtom(telegramIdAtom);

  const {
    data: tokens = [],
    isLoading: tokensLoading,
    error: tokensError,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: async () => {
      const response = await fetch(
        "https://sei-api.dragonswap.app/api/v1/tokens"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const tokens = data.tokens;
      // sort tokens by liquidity
      tokens.sort((a: any, b: any) => b.liquidity - a.liquidity);
      return tokens;
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: wallet,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet", telegramId],
    queryFn: async () => {
      const response = await fetch(`${HOST}/wallet/profile/${telegramId}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data } = useBalance({
    address: wallet?.address,
    query: {
      structuralSharing: false,
      refetchInterval: 5000,
    },
  });

  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const response = await fetch(`${HOST}/wallet/tokens/${telegramId}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  console.log("positions", positions);

  const positionsToRender = useMemo(() => {
    if (positionsLoading || tokensLoading || !positions || !tokens) return [];

    return positions
      .map((position: any) => {
        const token = tokens.find(
          (token: any) => token.symbol === position["coin__symbol"]
        );
        if (!token) return null;

        return {
          ...token,
          price: token["usd_price"],
          amount: position["total_amount"],
          // profitLoss: position.price - token.price,
        };
      });
  }, [positions, tokens, positionsLoading, tokensLoading]);

  console.log("positionsToRender", positionsToRender);

  const handleCopyClick = () => {
    if (wallet && wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4 mb-4">
        <div className="relative">
          <h1 className="text-2xl text-center font-bold">Portfolio</h1>
        </div>
        <div className="flex-grow mt-4 items-center flex flex-col mb-4">
          <Card className="w-full max-w-md p-6 grid gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                  <CoinsIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  {data ? (
                    <p className="text-xl font-semibold">
                      {`${formatNumber(data?.formatted)} ${data.symbol}`}
                    </p>
                  ) : (
                    <Skeleton className="w-30 h-6" />
                  )}
                  <p className="text-muted-foreground text-sm">
                    Current Balance
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground text-sm">
                  {wallet && wallet?.address && (
                    <p>
                      {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                    </p>
                  )}
                  {!wallet && <Skeleton className="w-10 h-6" />}
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
        </div>
        <Positions positions={positionsToRender} />
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
