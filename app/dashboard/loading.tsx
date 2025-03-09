import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardLoading() {
  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h2>
      </div>

      {/* Quick Actions - still show even when loading */}
      <div className="mb-6">
        <QuickActions />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
              <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 animate-pulse">
          <CardHeader>
            <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3 animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 w-full bg-zinc-200 dark:bg-zinc-700 rounded"
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
