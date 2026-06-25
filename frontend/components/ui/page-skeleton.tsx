import * as React from "react";
import { Skeleton } from "./skeleton";

export function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-border rounded-xl p-5 space-y-4 bg-card shadow-sm">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
          <div className="pt-4 border-t border-border flex justify-between">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border border-border rounded-lg p-4 bg-card shadow-sm">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <div className="space-y-4 pt-6 border-t border-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
