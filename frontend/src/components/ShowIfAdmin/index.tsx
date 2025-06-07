// src/components/ShowIfAdmin.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "@/src/components/hooks";

interface ShowIfAdminProps {
  children: ReactNode;
}

const ShowIfAdmin: React.FC<ShowIfAdminProps> = ({ children }) => {
  const { role } = useAppSelector((state) => state.user);
  const [roleD, setRoleD] = useState<number | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const localRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (localRole) {
      setRoleD(Number(localRole));
    }
    setChecking(false);
  }, []);

  if (checking) return null;

  const isAdmin = role !== 2 && (roleD === 0 || roleD === 1);
  return isAdmin ? <>{children}</> : null;
};

export default ShowIfAdmin;
