"use client";
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { BookCopy, Ellipsis, Loader2, RotateCw, Search, SearchX } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WorkspaceItemList from "./WorkspaceItemList";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

function WorkspaceList() {
  const { user, isLoaded } = useUser();
  const { orgId } = useAuth();
  const [workspaceList, setWorkspaceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) getWorkspaceList();
  }, [orgId, user]);

  const getWorkspaceList = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "Workspace"),
        where("orgId", "==", orgId || user?.primaryEmailAddress?.emailAddress)
      );
      const querySnapshot = await getDocs(q);
      const workspaces = querySnapshot.docs.map((doc) => doc.data());
      console.log("Fetched Workspaces:", workspaces);
      setWorkspaceList(workspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlagiarismCheck = async () => {
    setNavigating(true);
    setTimeout(() => {
      router.push("http://127.0.0.1:8000/");
    }, 1000);
  };

  useEffect(() => {
    if (searchTerm) {
      setTyping(true);
      const timeoutId = setTimeout(() => setTyping(false), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setTyping(false);
    }
  }, [searchTerm]);

  const filteredWorkspaces = workspaceList.filter((workspace) => {
    const workspaceName = workspace?.workspaceName?.toLowerCase() || "";
    return workspaceName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="relative">
      {/* Fullscreen Loader */}
      {navigating && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="text-white text-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            {/* <span className="mt-2">Redirecting...</span> */}
          </div>
        </div>
      )}

      <div className="my-10 p-10 md:px-24 lg:px-36 xl:px-52">
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">
            {isLoaded ? (
              `Hello, ${user?.fullName}`
            ) : (
              <Ellipsis className="animate-ping h-4 w-4" />
            )}
          </h2>
          <div className="flex justify-center items-center gap-2">
            <Link href={"/createworkspace"}>
              <Button>+</Button>
            </Link>
            <div className="relative inline-block">
  <Button
    variant="ghost"
    className="border-2 flex gap-2 justify-center items-center relative"
    onClick={handlePlagiarismCheck}
    disabled={navigating}
  >
    <BookCopy className="h-4 w-4" />
    Check Plagiarism
  </Button>
  {/* <span className="absolute top-0 right-0 bg-green-400 text-white text-xs font-medium px-2 py-1 rounded-full translate-x-1/2 -translate-y-1/2"> */}
    {/* New */}
  {/* </span> */}
</div>

          </div>
        </div>

        <div className="mt-10 flex justify-between items-center">
          <div>
            <h2 className="font-medium text-primary">Workspaces</h2>
          </div>
          <div className="flex gap-2 items-center relative">
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded px-3 py-1 border-2 outline-none focus:border-primary"
            />
            {typing ? (
              <RotateCw className="absolute right-2 h-4 w-4 text-primary animate-spin" />
            ) : (
              <Search className="absolute right-2 h-4 w-4 text-primary" />
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className="w-full antialiased font-light leading-relaxed bg-gray-300 animate-pulse rounded-lg h-[200px]"
              ></div>
            ))}
          </div>
        ) : filteredWorkspaces.length === 0 ? (
          <div className="flex flex-col justify-center items-center my-10">
            {searchTerm ? (
              <div className="flex flex-col justify-center items-center">
                <SearchX className="text-gray-600" />
                <h2 className="text-lg text-gray-600">
                  No results found for "{searchTerm}"
                </h2>
              </div>
            ) : (
              <div className="flex justify-center flex-col items-center">
                <Image
                  src={"/workspace.png"}
                  width={250}
                  height={250}
                  alt="workspace"
                />
                <h2>Create a new workspace</h2>
                <Link href={"/createworkspace"}>
                  <Button className="my-3">+ New Workspace</Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div>
            <WorkspaceItemList workspaceList={filteredWorkspaces} />
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspaceList;
