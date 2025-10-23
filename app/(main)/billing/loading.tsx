import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="h-10 w-3/4 bg-muted rounded mb-4 animate-pulse" />
        {/* Current Subscription Skeleton */}
        <div className="bg-card rounded-lg shadow-md border p-6 animate-pulse">
          <div className="h-6 w-1/4 bg-muted rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-5 w-1/2 bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-2/3 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-10 w-32 bg-muted rounded mt-4" />
            </div>
          </div>
        </div>
        {/* Plans Skeleton */}
        <div className="bg-card rounded-lg shadow-md border p-6 animate-pulse">
          <div className="h-6 w-1/4 bg-muted rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6 space-y-4">
                <div className="h-5 w-1/2 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-6 w-1/3 bg-muted rounded" />
                <div className="h-3 w-1/4 bg-muted rounded" />
                <div className="h-4 w-8 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
