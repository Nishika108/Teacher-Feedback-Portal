"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Store/auth"; 

export default function LogoutPage(): JSX.Element {
  const { removeTokenLS } = useAuth();
  const router = useRouter();

  useEffect(() => {
    removeTokenLS();

    router.push("/Login");
  }, [removeTokenLS, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-semibold">Logging out...</p>
    </div>
  );
}
