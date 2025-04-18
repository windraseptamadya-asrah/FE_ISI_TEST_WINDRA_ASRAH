"use client";

import Button from "@/lib/components/button";
import { IState } from "@/lib/scripts/store/store-provider";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Header() {
  const { user } = useSelector((state: IState) => state.user);
  const isLead = user?.role === "lead";

  return (
    <header className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Todo</h1>
      <div>
        {isLead &&
          <Link href="/add" className="mr-2">
            <Button>Add todo</Button>
          </Link>
        }
      </div>
    </header>
  );
}
