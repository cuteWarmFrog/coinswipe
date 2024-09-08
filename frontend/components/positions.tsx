"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useBalance } from "wagmi";
import { HOST, telegramIdAtom } from "@/lib/utils";
import axios from "axios";
import { useAtom } from "jotai";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Position = {
  address: string;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  price: number;
};

const PositionRow = ({ position }: { position: Position }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [telegramId] = useAtom(telegramIdAtom);

  const queryClient = useQueryClient();

  const {
    data: wallet,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet", telegramId],
    queryFn: async () => {
      const response = await fetch(`${HOST}/wallet/profile/${telegramId}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data } = useBalance({
    address: wallet?.address as `0x${string}`,
    token: position.address as `0x${string}`,
  });

  const sell = useCallback(async () => {
    axios.post(`${HOST}/sell_memecoin/`, {
      memecoin_address: position.address,
      telegram_id: telegramId,
    });

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      console.log("invalidated positions");
    }, 10000);
  }, []);

  if (data?.formatted === "0") {
    return null;
  }

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{position.name}</div>
        <div className="text-muted-foreground text-sm">{position.symbol}</div>
      </TableCell>
      <TableCell>{Number(data?.formatted).toFixed(4)}</TableCell>
      <TableCell>${Number(position.price).toFixed(5)}</TableCell>
      <TableCell>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              Sell
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Close Position</DialogTitle>
              <DialogDescription>
                Are you sure you want to close your {position.name} position?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  sell();
                  setIsDialogOpen(false);
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export function Positions({ positions }: { positions: Position[] }) {
  return (
    <Card>
      <div className="p-2">
        <CardTitle>Token Positions</CardTitle>
        <CardDescription>
          Your current token holdings and performance.
        </CardDescription>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Price</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position, index) => (
            <PositionRow key={index} position={position} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
