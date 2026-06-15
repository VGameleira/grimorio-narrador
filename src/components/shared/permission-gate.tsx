"use client";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
type PermissionGateProps = {
  role: "MASTER" | "PLAYER";
  children: ReactNode;
  fallback?: ReactNode;
};
export function PermissionGate({
  role,
  children,
  fallback,
}: PermissionGateProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  if (role === "MASTER" && userRole !== "MASTER") {
    return fallback ?? null;
  }
  return <>{children}</>;
}
