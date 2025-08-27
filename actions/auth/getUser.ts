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

/**
 * Retrieves the current user data with intelligent caching
 * 
 * This function implements in-memory caching to reduce API calls to the backend.
 * Each user session gets its own cache entry based on the JWT token.
 * 
 * Cache behavior:
 * - First call: Fetches from API and caches for 5 minutes
 * - Subsequent calls: Returns cached data if still fresh
 * - Cache invalidation: Manual invalidation after user updates
 * - Different sessions: Separate cache entries per user
 * 
 * @returns Promise<User | null> The user data or null if not authenticated
 */
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

/**
 * Invalidates the cached user data for the current session
 * Call this after user profile updates to ensure fresh data on next getUser() call
 */
export async function invalidateUserCache(): Promise<void> {
  const cookieStore = await cookies();
  const sessionJwt = cookieStore.get("session")?.value;
  
  if (sessionJwt) {
    userCache.delete(sessionJwt);
  }
}

/**
 * Clears all cached user data (for cleanup or debugging)
 * Use sparingly as it affects all user sessions
 */
export function clearAllUserCache(): void {
  userCache.clear();
}
