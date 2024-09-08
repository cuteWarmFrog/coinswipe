"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Skeleton } from "./ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import web3 from "web3";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { formatNumber, TELEGRAM_MOCK_ID } from "@/lib/utils";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  name: string;
  symbol: string;
  address: string;
  price: number;
  liquidity: number;
  volume: number;
  changeToken: () => void;
  change: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
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
    data: tokenStats,
    isLoading: volumeIsLoading,
    error,
  } = useQuery({
    queryKey: ["tokenData", address],
    queryFn: async () => {
      const response = await axios.get(
        `https://sei-api.dragonswap.app/api/v1/tokens/${address}/stats`
      );
      return response.data;
    },
  });

  const volume = useMemo(() => {
    if (!tokenStats) return 0;

    const daily = tokenStats?.stats?.daily;
    const last = daily[daily.length - 1];
    return last["daily_volume"];
  }, [tokenStats]);

  const pricesForLast30Days = useMemo(() => {
    if (!tokenStats) return [];

    const prices = tokenStats?.stats?.daily;
    return prices.slice(-30).map((el) => el["usd_price"]);
  }, [tokenStats]);

  const chartData = {
    labels: pricesForLast30Days.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: "Price",
        data: pricesForLast30Days,
        fill: false,
        borderColor:
          pricesForLast30Days[pricesForLast30Days.length - 1] >
          pricesForLast30Days[0]
            ? "rgb(0, 255, 0)"
            : "rgb(255, 0, 0)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "30 Day Price History",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  useEffect(() => {
    if (prevSymbolRef.current !== symbol) {
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
        api.start({ x: mx, immediate: true });
      } else {
        const trigger = Math.abs(vx) > 0.3;
        const dir = xDir < 0 ? -1 : 1;
        if (trigger) {
          console.log(dir === 1 ? "Swiped right (Buy)" : "Swiped left (Skip)");
          animateSwipe(dir);
        } else {
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

  const buyMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "https://coinswipe.pythonanywhere.com/perform_swap",
        {
          memecoin_address: address,
          telegram_id: TELEGRAM_MOCK_ID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Buy successful");
      // animateSwipe(1);
    },
    onError: (error) => {
      console.error("Buy failed", error);
      // Optionally handle the error case
    },
  });

  const onBuy = () => {
    buyMutation.mutate();
    animateSwipe(1);
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
        <div className="flex flex-col justify-center items-center mb-4">
          <div className="w-[128px] h-[128px] ml-2 mt-2 mb-4">
            {address ? (
              <Image
                src={`https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/${web3.utils.toChecksumAddress(
                  address
                )}/logo.png`}
                alt={name}
                width={128}
                height={128}
                placeholder="blur"
                blurDataURL={`https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/${web3.utils.toChecksumAddress(
                  address
                )}/logo.png`}
              />
            ) : (
              <Skeleton className="w-[100px] h-[100px] rounded-full" />
            )}
          </div>
          <div className="flex items-center justify-center">
            <h3 className="text-center text-2xl font-semibold">{name}</h3>
            <p className="bg-muted w-fit px-1 rounded text-muted-foreground text-base">
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
          <div className="w-full h-40">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={onSkip} variant="destructive">
              Skip
            </Button>
            <Button
              onClick={onBuy}
              variant="default"
              className="bg-green-500 hover:bg-green-600"
              disabled={buyMutation.isPending}
            >
              {buyMutation.isPending ? "Buying..." : "Buy"}
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
