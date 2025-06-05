import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedEnrollments: string[]; // list of enrollment numbers allowed
  getCurrentEnrollment: () => string | null; // function to get current user enrollment
  fallbackPath?: string; // where to redirect if unauthorized, default "/login"
}

export default function ProtectedRoute({
  children,
  allowedEnrollments,
  getCurrentEnrollment,
  fallbackPath = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const enrollment = getCurrentEnrollment();

    if (!enrollment || !allowedEnrollments.includes(enrollment)) {
      // Not authorized - redirect or block
      setAuthorized(false);
      router.replace(fallbackPath);
    } else {
      setAuthorized(true);
    }
  }, [allowedEnrollments, getCurrentEnrollment, router, fallbackPath]);

  if (authorized === null) {
    // You can show loading spinner here if needed
    return null;
  }

  if (!authorized) {
    return <p>Access Denied</p>; // or return null since redirect happens
  }

  return <>{children}</>;
}
