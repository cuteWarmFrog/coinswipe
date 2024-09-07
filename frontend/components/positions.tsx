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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type Position = {
  token: string;
  symbol: string;
  amount: number;
  price: number;
  profitLoss: number;
};

const PositionRow = ({ position }: { position: Position }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{position.token}</div>
        <div className="text-muted-foreground text-sm">{position.symbol}</div>
      </TableCell>
      <TableCell>{position.amount}</TableCell>
      <TableCell>${position.price.toLocaleString()}</TableCell>
      <TableCell>
        <div
          className={`${
            position.profitLoss >= 0 ? "text-green-500" : "text-red-500"
          } font-medium`}
        >
          {position.profitLoss >= 0 ? "+" : "-"}$
          {Math.abs(position.profitLoss).toLocaleString()}
        </div>
      </TableCell>
      <TableCell>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Close Position</DialogTitle>
              <DialogDescription>
                Are you sure you want to close your {position.token} position?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle closing position here
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
            <TableHead>P/L</TableHead>
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
