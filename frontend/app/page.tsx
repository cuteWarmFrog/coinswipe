import Image from "next/image";
import NavBar from "@/components/nav-bar";
import CoinCard from "@/components/coin-card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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
