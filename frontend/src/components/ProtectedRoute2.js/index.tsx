"use client";
import { getUserInfo } from "@/src/utils/authUtils";

interface Props {
  allowedEnrollmentNumbers: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute2({ allowedEnrollmentNumbers, children }: Props) {
  const user = getUserInfo();

  if (!user || !allowedEnrollmentNumbers.includes(user.enrollment_number)) {
    return null;
  }

  return <>{children}</>;
}
