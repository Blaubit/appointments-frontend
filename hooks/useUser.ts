"use client";

import { useEffect, useState } from "react";
import type { User } from "@/types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="))
        ?.split("=")[1];

      if (cookie) {
        const decoded = decodeURIComponent(cookie);
        const parsedUser = JSON.parse(decoded);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error };
}
