"use client";

import Image from "next/image";
import NavBar from "@/components/nav-bar";
import CoinCard from "@/components/coin-card";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type Token = {
  name: string;
  symbol: string;
  address: string;
};

export default function Home() {
  const [tokenIndex, setTokenIndex] = useState(0);

  const {
    data: tokens = [],
    isLoading,
    error,
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

  console.log("huy", JSON.stringify(tokens[tokenIndex]));

  const changeToken = () => {
    setTokenIndex((prevIndex) => (prevIndex + 1) % tokens.length);
  };

  const token = tokens[tokenIndex];

  const price = token?.["usd_price"] ?? 0;
  const volume = token?.["daily_volume"] ?? 0;
  const liquidity = token?.liquidity ?? 0;
  const change = token?.change;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex w-full flex-grow bg-background justify-center items-center">
        {tokens.length > 0 && (
          <CoinCard
            key={tokens[tokenIndex].symbol}
            address={tokens[tokenIndex].address}
            changeToken={changeToken}
            name={tokens[tokenIndex].name}
            symbol={tokens[tokenIndex].symbol}
            price={price}
            // fdv={tokens[tokenIndex].fdv}
            volume={volume}
            liquidity={liquidity}
            change={change}
            // image={tokens[tokenIndex].image}
          />
        )}
        {isLoading && <div>Loading...</div>}
      </main>
      <NavBar />
    </div>
  );
}
