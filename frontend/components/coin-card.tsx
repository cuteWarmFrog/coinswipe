"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useTheme } from "next-themes";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import web3 from "web3";

type Props = {
  name: string;
  symbol: string;
  address: string;
  price: number;
  liquidity: number;
  volume: number;
  // image: string;
  changeToken: () => void;
  change: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toFixed(2);
  }
};

export default function Component(props: Props) {
  const { name, symbol, changeToken, address, price, liquidity, change } =
    props;
  const [gone, setGone] = useState(false);
  const dragRef = useRef<number>(0);
  const prevSymbolRef = useRef<string>(symbol);

  const [{ x, rotate }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
  }));

  const {
    data: volume,
    isLoading: volumeIsLoading,
    error,
  } = useQuery({
    queryKey: ["tokenData", address],
    queryFn: async () => {
      const response = await fetch(
        `https://sei-api.dragonswap.app/api/v1/tokens/${address}/stats`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const daily = data.stats.daily;
      const last = daily[daily.length - 1];
      return last["daily_volume"];
    },
  });

  useEffect(() => {
    if (prevSymbolRef.current !== symbol) {
      // Reset to default state
      api.start({ x: 0, rotate: 0 });
      setGone(false);
      dragRef.current = 0;
    }
    prevSymbolRef.current = symbol;
  }, [symbol, api]);

  const animateSwipe = (direction: number) => {
    setGone(true);
    api.start({
      x: (200 + window.innerWidth) * direction,
      rotate: dragRef.current / 100 + direction * 10 * 1,
      config: { friction: 50, tension: 200 },
    });
    setTimeout(() => {
      changeToken();
    }, 300);
  };

  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      dragRef.current = mx;
      if (down) {
        // Only update x position while dragging
        api.start({ x: mx, immediate: true });
      } else {
        const trigger = Math.abs(vx) > 0.3;
        const dir = xDir < 0 ? -1 : 1;
        if (trigger) {
          // Handle swipe action (e.g., skip or buy)
          console.log(dir === 1 ? "Swiped right (Buy)" : "Swiped left (Skip)");
          animateSwipe(dir);
        } else {
          // Return to center if not triggered
          api.start({
            x: 0,
            rotate: 0,
            config: { friction: 50, tension: 500 },
          });
        }
      }
    }
  );

  const formattedPrice = formatNumber(price);
  const formattedVolume = useMemo(
    () => (volumeIsLoading ? 0 : formatNumber(volume)),
    [volume, volumeIsLoading]
  );
  const formattedLiquidity = formatNumber(liquidity);

  const onBuy = () => {
    animateSwipe(1);
    console.log("Buy");
  };

  const onSkip = () => {
    animateSwipe(-1);
    console.log("Skip");
  };

  return (
    <animated.div {...bind()} style={{ x, rotate }} className="w-full">
      <Card
        className={`mx-auto max-w-sm bg-gray-200 dark:bg-slate-900 rounded-xl shadow-lg p-2`}
      >
        <div className="flex items-center">
          <div className="relative w-[78px] h-[78px]">
            {address ? (
              <Image
                src={`https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/${web3.utils.toChecksumAddress(
                  address
                )}/logo.png`}
                alt={name}
                width={78}
                height={78}
                placeholder="blur"
                blurDataURL={`https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/${web3.utils.toChecksumAddress(
                  address
                )}/logo.png`}
              />
            ) : (
              <Skeleton className="w-[100px] h-[100px] rounded-full" />
            )}
          </div>
          <div className="w-full justify-center">
            <h3 className="text-center text-xl font-semibold">{name}</h3>
            <p className="mx-auto bg-muted w-fit px-1 rounded text-center text-muted-foreground text-sm">
              ${symbol}
            </p>
          </div>
        </div>
        <CardContent className="p-2 space-y-4">
          <div className="flex items-center justify-around">
            <div className="px-2 rounded">
              <p className="text-[10px] text-center">PRICE</p>
              <p className="text-xs text-center">${formattedPrice}</p>
            </div>
            <div className="px-2 rounded">
              <p className="text-[10px] text-center">VOLUME</p>
              <p className="text-xs text-center">
                ${volumeIsLoading ? "..." : formattedVolume}
              </p>
            </div>
            <div className="px-2 rounded">
              <p className="text-[10px] text-center">LIQUIDITY</p>
              <p className="text-xs text-center">${formattedLiquidity}</p>
            </div>
          </div>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-[10px]">1H</p>
              <p
                className={`text-xs ${
                  change?.hourly >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {isNaN(change?.hourly) ? "N/A" : `${change.hourly.toFixed(2)}%`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px]">24H</p>
              <p
                className={`text-xs ${
                  change?.daily >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {isNaN(change?.daily) ? "N/A" : `${change.daily.toFixed(2)}%`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px]">7D</p>
              <p
                className={`text-xs ${
                  change?.weekly >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {isNaN(change?.weekly) ? "N/A" : `${change.weekly.toFixed(2)}%`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px]">30D</p>
              <p
                className={`text-xs ${
                  change?.monthly >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {isNaN(change?.monthly)
                  ? "N/A"
                  : `${change.monthly.toFixed(2)}%`}
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={onSkip} variant="destructive">
              Skip
            </Button>
            <Button
              onClick={onBuy}
              variant="default"
              className="bg-green-500 hover:bg-green-600"
            >
              Buy
            </Button>
          </div>
        </CardContent>
      </Card>
    </animated.div>
  );
}

function HeartIcon(props) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
