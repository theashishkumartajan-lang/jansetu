"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { onAuthChange } from "@/services/firebase/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser, setIsAuthenticated } = useAppStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const readyFallback = window.setTimeout(() => {
      if (isMounted) {
        setIsAuthenticated(false);
        setIsReady(true);
      }
    }, 2500);

    const unsubscribe = onAuthChange((user) => {
      if (!isMounted) return;
      window.clearTimeout(readyFallback);

      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsReady(true);
    });

    return () => {
      isMounted = false;
      window.clearTimeout(readyFallback);
      unsubscribe();
    };
  }, [setCurrentUser, setIsAuthenticated]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0A2540] flex items-center justify-center">
        <div className="animate-pulse text-white text-sm">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
