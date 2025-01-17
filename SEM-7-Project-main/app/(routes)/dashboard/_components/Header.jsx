"use client";
import Logo from "@/app/_components/Logo";
import { db } from "@/config/firebaseConfig";
import {
  OrganizationSwitcher,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ellipsis, Loader2 } from "lucide-react";

function Header() {
  const { orgId, isLoaded, switchOrganization } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // state to track if loading is in progress

  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded) {
      setLoading(false); // Set loading to false when the Clerk components are fully loaded
    }
  }, [isLoaded]);

  /**
   * Used to save user data
   */
  const saveUserData = async () => {
    const docId = user?.primaryEmailAddress?.emailAddress;
    try {
      await setDoc(doc(db, "LoopUsers", docId), {
        name: user?.fullName,
        avatar: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
      });
    } catch (e) {
      console.error("Error saving user data:", e);
    }
  };

  // Redirect to dashboard after switching organizations
  const handleSwitchOrganization = async () => {
    if (isLoaded) {
      await switchOrganization();
      router.push("/dashboard"); // Redirect to the dashboard after switching
    }
  };

  if (loading) {
    // Show a loading spinner or any other placeholder
    return (
      <div className="flex justify-center items-center p-3 shadow-md py-[1.18rem] h-13">
        <Ellipsis className="animate-ping h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-3 shadow-md h-13">
      <Logo />
      <OrganizationSwitcher
        onSwitch={handleSwitchOrganization} // Use the onSwitch handler here
      />
      <UserButton />
    </div>
  );
}

export default Header;
