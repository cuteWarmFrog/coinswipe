import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { http, createConfig } from "wagmi";
import { sei } from "wagmi/chains";

export const config = createConfig({
  chains: [sei],
  transports: {
    [sei.id]: http(),
  },
});

export const formatNumber = (num: number | string): string => {
  const number = typeof num === "string" ? parseFloat(num) : num;

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toFixed(2);
  }
};


export const TELEGRAM_MOCK_ID = 'developer';
