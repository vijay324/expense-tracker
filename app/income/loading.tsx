import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function IncomeLoading() {
  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
