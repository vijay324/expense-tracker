"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";
import { IncomeDialog } from "@/components/income/income-dialog";
import { CategoryInfoDialog } from "@/components/categories/category-info-dialog";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
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
          />
          <IncomeDialog
            buttonVariant="default"
            className="w-full sm:w-auto mx-2"
            onSuccess={handleSuccess}
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
