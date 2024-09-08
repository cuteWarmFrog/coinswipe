"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HOST, telegramIdAtom } from "@/lib/utils";
import { useAtom } from "jotai";
import { useCall } from "wagmi";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type MatchItemProps = {
  name: string;
  image: string;
  link: string;
  usernameLink?: string;
};

type MatchListProps = {
  matches: MatchItemProps[];
};

const MatchItem = ({ name, image, link, usernameLink }: MatchItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [telegramId] = useAtom(telegramIdAtom);

  const { toast } = useToast();

  const fetchAiMessage = useCallback(async () => {
    setIsLoading(true);
    let response;
    try {
      response = await axios.get(`${HOST}/get_message/${telegramId}/`);
      toast({
        title: "We generated intro for you!",
        description:
          "Message copied to clipboard. You can now paste it in your chat.",
      });

      navigator.clipboard.writeText(response.data.message);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [telegramId, toast]);

  return (
    <div
      className={`flex items-center gap-4 rounded-lg p-4 shadow-md border border-white`}
    >
      <Avatar className="">
        <AvatarImage src={image} alt={`${name}'s Avatar`} />
        {/* <AvatarFallback>{avatarFallback}</AvatarFallback> */}
      </Avatar>
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <p className="text-xs text-gray-500">Seiyan, Inspector, Popo the cat</p>
      </div>
      <Button
        onClick={fetchAiMessage}
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        {!isLoading ? (
          "AI"
        ) : (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </Button>
      <Link href={link} passHref>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // window.open(link, "_blank");

            // @ts-ignore
            window?.Telegram?.WebApp?.openTelegramLink(usernameLink);
          }}
        >
          <MessageCircleIcon className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export function MatchList({ matches }: MatchListProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        {matches.map((match, index) => (
          <MatchItem key={index} {...match} />
        ))}
      </div>
    </div>
  );
}

function MessageCircleIcon(props) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
