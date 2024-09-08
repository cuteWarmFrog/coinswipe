"use client";

import React from "react";
import NavBar from "@/components/nav-bar";
import { MatchList } from "@/components/matches";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { verify } from "./actions/verify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// TODO: Calls your implemented server route
const verifyProof = async (proof) => {
  console.log(
    "Proof received from IDKit, sending to backend:\n",
    JSON.stringify(proof)
  ); // Log the proof from IDKit to the console for visibility
  const data = await verify(proof);

  if (data.success) {
    console.log("Successful response from backend:\n", JSON.stringify(data)); // Log the response from our backend for visibility
  } else {
    throw new Error(`Verification failed: ${data.error}`);
  }
};

const LoginPage = () => {
  const router = useRouter();

  const onSuccess = () => {
    router.push("/swipe");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#171717] to-[#414141]">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
        <img
          src="coinswipe_logo.svg"
          alt="Welcome"
          className="w-64 h-auto mb-6 mx-auto"
        />
        <p className="text-gray-600 mb-8">Verify your identity to continue</p>
        <IDKitWidget
          app_id="app_b705f9962c72ec01782c091f7646b71a"
          action="aa"
          verification_level={VerificationLevel.Device}
          handleVerify={verifyProof}
          onSuccess={onSuccess}
        >
          {({ open }) => (
            <button
              onClick={open}
              className="bg-gradient-to-r from-[#EF4A75] to-[#FD5564] text-white font-semibold py-3 px-6 rounded-full hover:opacity-90 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Verify with World ID
            </button>
          )}
        </IDKitWidget>
      </div>
      <Button variant="ghost">
        <Link href="/swipe">Skip</Link>
      </Button>
    </div>
  );
};

export default LoginPage;
