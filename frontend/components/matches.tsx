"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

type MatchItemProps = {
  name: string;
  image: string;
};

type MatchListProps = {
  matches: MatchItemProps[];
};

const MatchItem = ({ name, image }: MatchItemProps) => {
  const { theme } = useTheme();
  return (
    <div
      className={`flex items-center gap-4 rounded-lg p-4 shadow-md ${
        theme === "dark" ? "border border-white" : "border border-black"
      }`}
    >
      <Avatar className="">
        <AvatarImage src={image} alt={`${name}'s Avatar`} />
        {/* <AvatarFallback>{avatarFallback}</AvatarFallback> */}
      </Avatar>
      <div className="flex-1">
        <div className="font-medium">{name}</div>
      </div>
      <Button variant="outline" size="sm">
        <MessageCircleIcon className="h-4 w-4" />
      </Button>
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
