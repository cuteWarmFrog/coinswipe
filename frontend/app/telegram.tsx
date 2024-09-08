"use client";

import { useEffect } from "react";
import { useAtom } from 'jotai'
import { telegramIdAtom } from "@/lib/utils";

export default function TelegramSetup() {
  const [telegramId, setTelegramId] = useAtom(telegramIdAtom);
  
  useEffect(() => {
    // @ts-ignore
    if (window?.Telegram?.WebApp) {
      // @ts-ignore
      window?.Telegram?.WebApp?.disableVerticalSwipes();
      // @ts-ignore
      const userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      // @ts-ignore
      const initData = window?.Telegram?.WebApp?.initDataUnsafe;

      if (userId) {
        setTelegramId(userId);
      }

      console.log("TELEGRAM_USER_ID", userId);
      console.log("initDataUnsafe", initData);
    }
  }, []);

  return null;
}
