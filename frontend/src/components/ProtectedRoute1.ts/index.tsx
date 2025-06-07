"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/src/utils/authUtils";

export default function ProtectedRoute1({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuth(true);
    }
  }, []);

  if (!isAuth) return null;

  return <>{children}</>;
}
