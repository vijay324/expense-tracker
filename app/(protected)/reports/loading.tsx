import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function ReportsLoading() {
  return (
    <div className="flex-1 container mx-auto px-4 max-w-7xl pt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
        <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
      </div>

      <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"
          ></div>
        ))}
      </div>

      <LoadingSkeleton title={false} chart={true} />

      <div className="mt-6">
        <LoadingSkeleton title={false} chart={true} />
      </div>
    </div>
  );
}
