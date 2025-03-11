import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-6 container px-4 max-w-7xl pt-8 mx-4">
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
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
