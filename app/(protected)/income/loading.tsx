import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function IncomeLoading() {
  return (
    <div className="flex-1 container mx-auto px-4 max-w-7xl pt-8">
      <LoadingSkeleton title={true} chart={true} />

      <div className="mt-6">
        <LoadingSkeleton title={true} list={true} listItems={5} />
      </div>
    </div>
  );
}
