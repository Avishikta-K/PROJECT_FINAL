"use client" 

import { useState, useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import { Loader, Loader2, Loader2Icon, LoaderCircleIcon, LoaderPinwheel, LoaderPinwheelIcon } from "lucide-react";

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading effect
    const timer = setTimeout(() => setLoading(false), 1000); // 1-second loading delay
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {loading ? (
        <div className="loader">
          {/* Replace this with your actual loader styling */}
         <Loader2 className="h-5 w-5 animate-spin"/>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
