"use client";

import Image from "next/image";
import NavBar from "@/components/nav-bar";
import CoinCard from "@/components/coin-card";
import { useEffect } from "react";

export default function Home() {
  //fetch data from api
  //https://sei-api.dragonswap.app/api/v1/tokens/0xC6BC81A0E287cC8103cC002147a9d76caE4cD6E5/stats
  useEffect(() => {
    (async () => {
      const data = await fetch(
        "https://sei-api.dragonswap.app/api/v1/tokens/0xC6BC81A0E287cC8103cC002147a9d76caE4cD6E5/stats"
      );
      const json = await data.json();
      console.log(json);
    })();
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex w-full flex-grow bg-background justify-center items-center">
        <CoinCard
          name="Bitcoin"
          symbol="BTC"
          price={100000}
          fdv={100000000}
          volume={100000000}
          liquidity={100000000}
          image="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400"
        />
      </main>
      <NavBar />
    </div>
  );
}
