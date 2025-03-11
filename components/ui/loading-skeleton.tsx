import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoadingSkeletonProps {
  title?: boolean;
  chart?: boolean;
  list?: boolean;
  listItems?: number;
  grid?: boolean;
  gridItems?: number;
  gridCols?: number;
}

export function LoadingSkeleton({
  title = true,
  chart = false,
  list = false,
  listItems = 5,
  grid = false,
  gridItems = 4,
  gridCols = 4,
}: LoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
        </div>
      )}

      {grid && (
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-${gridCols}`}>
          {Array.from({ length: gridItems }).map((_, i) => (
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
      )}

      {chart && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      )}

      {list && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: listItems }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
