"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExpensesTable } from "@/components/expenses/expenses-table";
import { ExpenseCategories } from "@/components/expenses/expense-categories";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string | Date;
  createdAt: string | Date;
}

interface ExpensesClientProps {
  initialExpenses: Expense[];
}

export function ExpensesClient({ initialExpenses }: ExpensesClientProps) {
  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 max-w-7xl pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Expenses
        </h2>
        <ExpenseDialog
          buttonVariant="default"
          buttonSize="default"
          showIcon={true}
          className="ml-4"
        />
      </div>

      {/* Expense Categories */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Expense Categories</CardTitle>
          <CardDescription>
            Summary of your expenses by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseCategories expenses={initialExpenses} />
        </CardContent>
      </Card>

      {/* Expense List Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Expense List</CardTitle>
          <CardDescription>
            View and manage your expense entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpensesTable expenses={initialExpenses} />
        </CardContent>
      </Card>
    </div>
  );
}
