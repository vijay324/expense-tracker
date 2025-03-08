"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, DollarSign, Code, Youtube } from "lucide-react";

interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

interface IncomeCategoriesProps {
  incomes: any[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Job":
      return <Briefcase className="h-5 w-5 text-emerald-500" />;
    case "Startup":
      return <DollarSign className="h-5 w-5 text-blue-500" />;
    case "Freelance":
      return <Code className="h-5 w-5 text-purple-500" />;
    case "Social Media":
      return <Youtube className="h-5 w-5 text-red-500" />;
    default:
      return <DollarSign className="h-5 w-5 text-gray-500" />;
  }
};

export function IncomeCategories({ incomes }: IncomeCategoriesProps) {
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>(
    []
  );

  useEffect(() => {
    // Group incomes by category and calculate totals
    const categoryMap = new Map<string, CategorySummary>();

    incomes.forEach((income) => {
      const category = income.category;
      const amount = parseFloat(income.amount);

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
  }, [incomes]);

  if (categorySummaries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Income Categories</CardTitle>
          <CardDescription>No income data available yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Income Categories</h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {categorySummaries.map((summary) => (
          <Card
            key={summary.category}
            className="overflow-hidden border-l-4 border-l-emerald-500"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
              <CardTitle className="text-sm font-medium">
                {summary.category}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                {getCategoryIcon(summary.category)}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                ₹{summary.total.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.count} {summary.count === 1 ? "source" : "sources"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
