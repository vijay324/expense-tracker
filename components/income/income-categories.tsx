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
  Briefcase,
  DollarSign,
  Code,
  TrendingUp,
  Building,
  Award,
  Lightbulb,
  Home,
  Coins,
  FileText,
  Landmark,
  PiggyBank,
  Gift,
  Wallet,
} from "lucide-react";
import {
  getIncomeCategoryBorderColor,
  getIncomeCategoryBgColor,
  getIncomeCategoryTextColor,
} from "@/lib/category-colors";

interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

interface IncomeCategoriesProps {
  incomes: any[];
}

const getCategoryIcon = (category: string) => {
  const textColorClass = getIncomeCategoryTextColor(category);

  switch (category) {
    case "Salary":
      return <Briefcase className={`h-5 w-5 ${textColorClass}`} />;
    case "Business":
      return <Building className={`h-5 w-5 ${textColorClass}`} />;
    case "Freelance":
      return <Code className={`h-5 w-5 ${textColorClass}`} />;
    case "Investment":
      return <TrendingUp className={`h-5 w-5 ${textColorClass}`} />;
    case "Bonus":
      return <Award className={`h-5 w-5 ${textColorClass}`} />;
    case "Side Hustle":
      return <Lightbulb className={`h-5 w-5 ${textColorClass}`} />;
    case "Rental Income":
      return <Home className={`h-5 w-5 ${textColorClass}`} />;
    case "Dividends":
      return <Coins className={`h-5 w-5 ${textColorClass}`} />;
    case "Tax Refund":
      return <FileText className={`h-5 w-5 ${textColorClass}`} />;
    case "Government Benefits":
      return <Landmark className={`h-5 w-5 ${textColorClass}`} />;
    case "Pension":
      return <PiggyBank className={`h-5 w-5 ${textColorClass}`} />;
    case "Gift":
      return <Gift className={`h-5 w-5 ${textColorClass}`} />;
    case "Inheritance":
      return <Wallet className={`h-5 w-5 ${textColorClass}`} />;
    // Include these for backward compatibility
    case "Job":
      return <Briefcase className={`h-5 w-5 ${textColorClass}`} />;
    case "Startup":
      return <Building className={`h-5 w-5 ${textColorClass}`} />;
    case "Social Media":
      return <Lightbulb className={`h-5 w-5 ${textColorClass}`} />;
    case "Other":
      return <DollarSign className={`h-5 w-5 ${textColorClass}`} />;
    default:
      return <DollarSign className={`h-5 w-5 ${textColorClass}`} />;
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
        {categorySummaries.map((summary) => {
          const borderColor = getIncomeCategoryBorderColor(summary.category);
          const bgColor = getIncomeCategoryBgColor(summary.category);

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
                  {summary.count} {summary.count === 1 ? "source" : "sources"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
