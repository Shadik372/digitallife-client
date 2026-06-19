"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import Loading from "./Loading";
import toast from "react-hot-toast";

export default function SellerRoute({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if (session.user.role !== "seller" && session.user.role !== "admin") {
        toast.error("Access denied. This area is for Sellers only.");
        router.push("/dashboard");
      }
    }
  }, [session, isPending, router]);

  if (isPending) return <Loading fullScreen />;
  if (!session || (session.user.role !== "seller" && session.user.role !== "admin")) return null;

  return <>{children}</>;
}