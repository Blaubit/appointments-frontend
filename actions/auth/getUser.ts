"use server";
import { cookies } from "next/headers";
import { User } from "@/types";
import findMe from "../user/findMe";
export type Payload = {
  userId: string;
  email: string;
  companyId: string;
  roleId: string;
  // Si tu payload tiene más propiedades, añádelas aquí
};

// Simple in-memory cache for user data
interface CacheEntry {
  user: User | null;
  timestamp: number;
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Global cache object - using session token as key
const userCache = new Map<string, CacheEntry>();

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionJwt = cookieStore.get("session")?.value;

  if (!sessionJwt) {
    return null;
  }

  // Check if we have cached data for this session
  const cacheKey = sessionJwt;
  const cacheEntry = userCache.get(cacheKey);
  
  // Return cached data if it's still fresh
  if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION) {
    return cacheEntry.user;
  }

  // Fetch fresh data from API
  try {
    const res = await findMe();
    let userData: User | null = null;
    
    if ("data" in res && res.status === 200 && res.data) {
      userData = res.data;
    }
    
    // Cache the result (success or null)
    userCache.set(cacheKey, {
      user: userData,
      timestamp: Date.now(),
    });
    
    return userData;
  } catch (error) {
    // Cache null result to avoid repeated failures
    userCache.set(cacheKey, {
      user: null,
      timestamp: Date.now(),
    });
    
    return null;
  }
}

// Helper function to invalidate cache for current session
export async function invalidateUserCache(): Promise<void> {
  const cookieStore = await cookies();
  const sessionJwt = cookieStore.get("session")?.value;
  
  if (sessionJwt) {
    userCache.delete(sessionJwt);
  }
}

// Helper function to clear all cached user data (for cleanup)
export function clearAllUserCache(): void {
  userCache.clear();
}
