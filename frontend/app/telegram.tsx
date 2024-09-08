"use client";

import { useEffect } from "react";

export default function TelegramSetup() {
  useEffect(() => {
    // @ts-ignore
    if (window?.Telegram?.WebApp) {
      // @ts-ignore
      window?.Telegram?.WebApp?.disableVerticalSwipes();
      // @ts-ignore
      const userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      console.log("TELEGRAM_USER_ID", userId);
      // @ts-ignore
      console.log("initDataUnsafe", window?.Telegram?.WebApp?.initDataUnsafe);
    }
  }, []);

  return null;
}
