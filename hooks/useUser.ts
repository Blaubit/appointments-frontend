"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types";
import { getUser } from "@/actions/auth/getUser"; // Ajusta la ruta al archivo donde esté la función getUser

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getUser()
      .then((u) => {
        if (isMounted) setUser(u);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, error };
}