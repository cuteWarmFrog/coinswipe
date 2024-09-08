"use client";

import { useEffect, useState } from "react";

export default function TelegramSetup() {
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [telegramData, setTelegramData] = useState<any>(null);

  useEffect(() => {
    // @ts-ignore
    if (window?.Telegram?.WebApp) {
      // @ts-ignore
      window?.Telegram?.WebApp?.disableVerticalSwipes();
      // @ts-ignore
      const userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      // @ts-ignore
      const initData = window?.Telegram?.WebApp?.initDataUnsafe;

      setTelegramId(userId);
      setTelegramData(initData);

      console.log("TELEGRAM_USER_ID", userId);
      console.log("initDataUnsafe", initData);
    }
  }, []);

  return (
    <div>
      <p>Telegram ID: {telegramId}</p>
      <p>Telegram Data: {JSON.stringify(telegramData)}</p>
    </div>
  );
}
