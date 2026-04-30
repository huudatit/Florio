"use client"; 

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore"; 

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    if (initAuth) {
      initAuth();
    }
  }, [initAuth]);

  return <>{children}</>;
}
