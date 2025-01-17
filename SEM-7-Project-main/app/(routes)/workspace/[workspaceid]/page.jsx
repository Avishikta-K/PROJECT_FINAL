import React from "react";
import SideNav from "../_components/SideNav";
import { Room } from "@/app/Room";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";

function Workspace({ params }) {
  // Determine if an item is selected based on the presence of documentid
  const isItemSelected = !params?.documentid;

  return (
    <div className="flex flex-col h-full">
      <Room params={params}>
        <SideNav params={params} />
        {/* Conditionally render the message and image if no item is selected */}
        {isItemSelected && (
          <div className="flex flex-col items-center justify-center h-full   ml-[35rem] m-[20rem]">
            {/* <Image src="/workspace.png" width={200} height={200} alt="Workspace Illustration" className="mb-4" /> */}
            {/* <p className="text-gray-700 text-lg font-semibold"> */}
              {/* Please select an item from the list. */}
            {/* </p> */}
            <LoaderCircle className=" animate-spin" />
    
          </div>
        )}
      </Room>
    </div>
  );
}

export default Workspace;
