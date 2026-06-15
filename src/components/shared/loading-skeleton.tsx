import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
type LoadingSkeletonProps = { className?: string; count?: number };
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border p-4", className)}>
      {" "}
      <Skeleton className="h-4 w-2/3 mb-2" />{" "}
      <Skeleton className="h-3 w-full mb-1" />{" "}
      <Skeleton className="h-3 w-4/5" />{" "}
    </div>
  );
}
export function ListSkeleton({ count = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {" "}
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}{" "}
    </div>
  );
}
export function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {" "}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border p-4">
          {" "}
          <Skeleton className="h-3 w-1/2 mb-2" />{" "}
          <Skeleton className="h-8 w-1/3" />{" "}
        </div>
      ))}{" "}
    </div>
  );
}
