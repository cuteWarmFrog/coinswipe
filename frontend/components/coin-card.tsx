"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/wHH5XYEA0gY
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useTheme } from "next-themes";

type Props = {
  name: string;
  symbol: string;
  price: number;
  fdv: number;
  liquidity: number;
  volume: number;
  image: string;
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
  const { name, symbol, price, fdv, volume, liquidity, image } = props;
  const [gone, setGone] = useState(false);
  const dragRef = useRef<number>(0);

  const { theme } = useTheme();

  const [{ x, rotate }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
  }));

  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      dragRef.current = mx;
      if (down) {
        // Only update x position while dragging
        api.start({ x: mx, immediate: true });
      } else {
        const trigger = Math.abs(vx) > 0.2;
        const dir = xDir < 0 ? -1 : 1;
        if (trigger) {
          // Handle swipe action (e.g., skip or buy)
          console.log(dir === 1 ? "Swiped right (Buy)" : "Swiped left (Skip)");
          setGone(true);
          api.start({
            x: (200 + window.innerWidth) * dir,
            rotate: mx / 100 + dir * 10 * vx,
            config: { friction: 50, tension: 200 },
          });
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
  const formattedVolume = formatNumber(volume);
  const formattedLiquidity = formatNumber(liquidity);
  const formattedFdv = formatNumber(fdv);

  return (
    <animated.div {...bind()} style={{ x, rotate }} className="w-full">
      <Card
        className={`mx-auto max-w-sm bg-gray-200 dark:bg-slate-900 rounded-xl shadow-lg p-2`}
      >
        <div className="flex items-center">
          <Image src={image} alt={name} width="100" height="100" />
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
              <p className="text-xs text-center">${formattedVolume}</p>
            </div>
            <div className="px-2 rounded">
              <p className="text-[10px] text-center">LIQUIDITY</p>
              <p className="text-xs text-center">${formattedLiquidity}</p>
            </div>
            <div className="px-2 rounded">
              <p className="text-[10px] text-center">FDV</p>
              <p className="text-xs text-center">${formattedFdv}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="destructive">Skip</Button>
            <Button
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
