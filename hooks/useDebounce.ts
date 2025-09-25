import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UseDebounceSearchOptions {
  delay?: number;
  minLength?: number;
  resetPage?: boolean;
  onSearch?: (value: string) => void;
  skipInitialSearch?: boolean;
}

export function useDebounceSearch(
  initialValue: string = "",
  options: UseDebounceSearchOptions = {}
) {
  const {
    delay = 500,
    minLength = 2,
    resetPage = true,
    onSearch,
    skipInitialSearch = true,
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const hasInitialized = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Skip initial search if configured to do so
    if (skipInitialSearch && !hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      // Only trigger search if term meets minimum length or is empty
      if (searchTerm.length >= minLength || searchTerm.length === 0) {
        if (onSearch) {
          onSearch(searchTerm);
        } else {
          updateURL(searchTerm);
        }
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm]);

  // URL update function - memoized with minimal dependencies
  const updateURL = useCallback((value: string) => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (value.trim() && value.length >= minLength) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    if (resetPage) {
      params.delete("page");
    }

    const newUrl = `${url.pathname}?${params.toString()}`;

    // Only navigate if URL actually changed
    if (newUrl !== window.location.pathname + window.location.search) {
      router.push(newUrl);
    }
  }, []); // Empty dependency array to prevent re-creation

  // Manual search handler
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    handleSearch,
    clearSearch,
    isSearching: timeoutRef.current !== undefined,
  };
}

// Alternative hook for cases where you want more control
export function useDebounceValue<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
