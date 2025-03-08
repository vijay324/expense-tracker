"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  ShoppingCart,
  BookOpen,
  Plane,
  Coffee,
  Dumbbell,
} from "lucide-react";
import {
  getExpenseCategoryBorderColor,
  getExpenseCategoryBgColor,
  getExpenseCategoryTextColor,
} from "@/lib/category-colors";

interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

interface ExpenseCategoriesProps {
  expenses: any[];
}

const getCategoryIcon = (category: string) => {
  const textColorClass = getExpenseCategoryTextColor(category);

  switch (category) {
    case "Bills & Recharge":
      return <CreditCard className={`h-5 w-5 ${textColorClass}`} />;
    case "Traveling":
      return <Plane className={`h-5 w-5 ${textColorClass}`} />;
    case "Entertainment":
      return <Coffee className={`h-5 w-5 ${textColorClass}`} />;
    case "Education & Courses":
      return <BookOpen className={`h-5 w-5 ${textColorClass}`} />;
    case "Health & Fitness":
      return <Dumbbell className={`h-5 w-5 ${textColorClass}`} />;
    default:
      return <ShoppingCart className={`h-5 w-5 ${textColorClass}`} />;
  }
};

export function ExpenseCategories({ expenses }: ExpenseCategoriesProps) {
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>(
    []
  );

  useEffect(() => {
    // Group expenses by category and calculate totals
    const categoryMap = new Map<string, CategorySummary>();

    expenses.forEach((expense) => {
      const category = expense.category;
      const amount = parseFloat(expense.amount);

      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        existing.total += amount;
        existing.count += 1;
        categoryMap.set(category, existing);
      } else {
        categoryMap.set(category, {
          category,
          total: amount,
          count: 1,
        });
      }
    });

    // Convert map to array and sort by total (descending)
    const summaries = Array.from(categoryMap.values()).sort(
      (a, b) => b.total - a.total
    );

    setCategorySummaries(summaries);
  }, [expenses]);

  if (categorySummaries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Expense Categories</CardTitle>
          <CardDescription>No expense data available yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Expense Categories</h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {categorySummaries.map((summary) => {
          const borderColor = getExpenseCategoryBorderColor(summary.category);
          const bgColor = getExpenseCategoryBgColor(summary.category);

          return (
            <Card
              key={summary.category}
              className={`overflow-hidden border-l-4 ${borderColor}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
                <CardTitle className="text-sm font-medium">
                  {summary.category}
                </CardTitle>
                <div
                  className={`h-8 w-8 rounded-full ${bgColor} flex items-center justify-center`}
                >
                  {getCategoryIcon(summary.category)}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">
                  ₹{summary.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.count} {summary.count === 1 ? "expense" : "expenses"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
