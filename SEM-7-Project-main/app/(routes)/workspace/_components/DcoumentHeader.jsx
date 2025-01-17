import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Arrow } from "@radix-ui/react-popover";
import { ArrowBigLeft, ArrowDownLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function DcoumentHeader() {
  return (
    <div className="flex justify-between items-center p-3 px-7 shadow-md">
      <div></div>
      <OrganizationSwitcher />
      <div className="flex gap-3">
        <Link href={"/dashboard"}>
          <Button className="flex justify-center items-center gap-2">
            <ArrowDownLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <UserButton />
      </div>
    </div>
  );
}

export default DcoumentHeader;
