"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";
import { IncomeDialog } from "@/components/income/income-dialog";
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
            className="w-full sm:w-auto"
            onSuccess={handleSuccess}
          />
          <IncomeDialog
            buttonVariant="outline"
            className="w-full sm:w-auto"
            onSuccess={handleSuccess}
          />
        </div>
      </CardContent>
    </Card>
  );
}
