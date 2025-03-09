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
  Home,
  Utensils,
  ShoppingBag,
  Car,
  Plug,
  Heart,
  Shield,
  DollarSign,
  Tv,
  Calendar,
  Scissors,
  Gift,
  Baby,
  Hammer,
  Shirt,
  Landmark,
  Briefcase,
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
    case "Housing":
      return <Home className={`h-5 w-5 ${textColorClass}`} />;
    case "Food":
      return <Utensils className={`h-5 w-5 ${textColorClass}`} />;
    case "Groceries":
      return <ShoppingBag className={`h-5 w-5 ${textColorClass}`} />;
    case "Restaurant & Dining Out":
      return <Utensils className={`h-5 w-5 ${textColorClass}`} />;
    case "Transportation":
      return <Car className={`h-5 w-5 ${textColorClass}`} />;
    case "Utilities":
      return <Plug className={`h-5 w-5 ${textColorClass}`} />;
    case "Bills & Recharge":
      return <CreditCard className={`h-5 w-5 ${textColorClass}`} />;
    case "Healthcare":
      return <Heart className={`h-5 w-5 ${textColorClass}`} />;
    case "Insurance":
      return <Shield className={`h-5 w-5 ${textColorClass}`} />;
    case "Debt Payments":
      return <DollarSign className={`h-5 w-5 ${textColorClass}`} />;
    case "Entertainment":
      return <Tv className={`h-5 w-5 ${textColorClass}`} />;
    case "Shopping":
      return <ShoppingCart className={`h-5 w-5 ${textColorClass}`} />;
    case "Subscriptions":
      return <Calendar className={`h-5 w-5 ${textColorClass}`} />;
    case "Education":
      return <BookOpen className={`h-5 w-5 ${textColorClass}`} />;
    case "Personal Care":
      return <Scissors className={`h-5 w-5 ${textColorClass}`} />;
    case "Travel":
      return <Plane className={`h-5 w-5 ${textColorClass}`} />;
    case "Gifts & Donations":
      return <Gift className={`h-5 w-5 ${textColorClass}`} />;
    case "Childcare":
      return <Baby className={`h-5 w-5 ${textColorClass}`} />;
    case "Home Maintenance":
      return <Hammer className={`h-5 w-5 ${textColorClass}`} />;
    case "Clothing":
      return <Shirt className={`h-5 w-5 ${textColorClass}`} />;
    case "Taxes":
      return <Landmark className={`h-5 w-5 ${textColorClass}`} />;
    case "Health & Fitness":
      return <Dumbbell className={`h-5 w-5 ${textColorClass}`} />;
    case "Education & Courses":
      return <BookOpen className={`h-5 w-5 ${textColorClass}`} />;
    case "Traveling":
      return <Plane className={`h-5 w-5 ${textColorClass}`} />;
    default:
      return <Briefcase className={`h-5 w-5 ${textColorClass}`} />;
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
