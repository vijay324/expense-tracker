"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";
import { IncomeDialog } from "@/components/income/income-dialog";
import { CategoryInfoDialog } from "@/components/categories/category-info-dialog";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function QuickActions() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = () => {
    setIsLoading(false);
    router.refresh();
    toast.success("Operation completed successfully!");
  };

  const handleError = (error: any) => {
    setIsLoading(false);
    console.error("Quick action error:", error);
    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <ExpenseDialog
            buttonVariant="default"
            className="w-full sm:w-auto mx-2"
            onSuccess={handleSuccess}
            onError={handleError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <IncomeDialog
            buttonVariant="default"
            className="w-full sm:w-auto mx-2"
            onSuccess={handleSuccess}
            onError={handleError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <CategoryInfoDialog
            buttonVariant="outline"
            className="w-full sm:w-auto mx-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
