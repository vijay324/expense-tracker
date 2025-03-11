import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex-1 container mx-auto px-4 max-w-7xl pt-8">
      <LoadingSkeleton title={true} grid={true} gridItems={4} gridCols={4} />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <LoadingSkeleton title={false} chart={true} />
        <LoadingSkeleton title={false} list={true} listItems={3} />
      </div>
    </div>
  );
}
