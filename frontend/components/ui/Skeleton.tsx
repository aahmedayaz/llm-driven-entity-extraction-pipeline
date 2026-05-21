import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[var(--bg-input)]/80",
        className,
      )}
      aria-hidden
    />
  );
}

export function AddressListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className="space-y-2" aria-busy="true" aria-label="Loading addresses">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <Skeleton className="h-14 w-full rounded-xl" />
        </li>
      ))}
    </ul>
  );
}

export function DossierSkeleton() {
  return (
    <div className="surface-elevated space-y-3 rounded-2xl p-4 sm:p-5" aria-busy="true">
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}
