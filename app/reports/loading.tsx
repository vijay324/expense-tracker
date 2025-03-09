import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ReportsLoading() {
  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
        <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
      </div>

      <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-32 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-32 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
        </div>

        <div className="h-[400px] w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
        <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
