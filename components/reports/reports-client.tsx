"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getIncomeCategoryBgColor,
  getExpenseCategoryBgColor,
  getIncomeCategoryTextColor,
  getExpenseCategoryTextColor,
} from "@/lib/category-colors";

interface ReportsClientProps {
  yearsWithData: number[];
  defaultYear: number;
}

interface Income {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string | Date;
  createdAt: string | Date;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string | Date;
  createdAt: string | Date;
}

interface MonthlyData {
  name: string;
  income: number;
  expenses: number;
}

interface CategoryData {
  name: string;
  value: number;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Helper function to get tailwind bg color and convert to hex for charts
const getTailwindColorHex = (tailwindClass: string): string => {
  // Map of tailwind color classes to high-contrast hex values for both light and dark modes
  const colorMap: Record<string, string> = {
    // Blues (High Contrast)
    "bg-blue-50": "#1E88E5", // Bright medium blue
    "bg-blue-100": "#1976D2", // Slightly darker blue
    "bg-blue-700": "#0D47A1", // Deep blue
    // Greens (High Contrast)
    "bg-green-50": "#43A047", // Bright medium green
    "bg-green-100": "#388E3C", // Slightly darker green
    "bg-green-700": "#1B5E20", // Deep green
    // Emeralds (High Contrast)
    "bg-emerald-50": "#00BFA5", // Bright teal
    "bg-emerald-100": "#00897B", // Medium teal
    "bg-emerald-700": "#004D40", // Deep teal
    // Purples (High Contrast)
    "bg-purple-50": "#8E24AA", // Bright medium purple
    "bg-purple-100": "#7B1FA2", // Slightly darker purple
    "bg-purple-700": "#4A148C", // Deep purple
    // Ambers (High Contrast)
    "bg-amber-50": "#FFB300", // Bright amber
    "bg-amber-100": "#FFA000", // Medium amber
    "bg-amber-700": "#FF6F00", // Deep amber
    // Limes (High Contrast)
    "bg-lime-50": "#C0CA33", // Bright lime
    "bg-lime-100": "#AFB42B", // Medium lime
    "bg-lime-700": "#827717", // Deep lime
    // Teals (High Contrast)
    "bg-teal-50": "#26A69A", // Bright teal
    "bg-teal-100": "#00897B", // Medium teal
    "bg-teal-700": "#00695C", // Deep teal
    // Cyans (High Contrast)
    "bg-cyan-50": "#00ACC1", // Bright cyan
    "bg-cyan-100": "#0097A7", // Medium cyan
    "bg-cyan-700": "#006064", // Deep cyan
    // Indigos (High Contrast)
    "bg-indigo-50": "#5C6BC0", // Bright indigo
    "bg-indigo-100": "#3F51B5", // Medium indigo
    "bg-indigo-700": "#283593", // Deep indigo
    // Fuchsias (High Contrast)
    "bg-fuchsia-50": "#D500F9", // Bright fuchsia
    "bg-fuchsia-100": "#C51162", // Medium fuchsia
    "bg-fuchsia-700": "#AA00FF", // Deep fuchsia
    // Violets (High Contrast)
    "bg-violet-50": "#9575CD", // Bright violet
    "bg-violet-100": "#7E57C2", // Medium violet
    "bg-violet-700": "#5E35B1", // Deep violet
    // Pinks (High Contrast)
    "bg-pink-50": "#EC407A", // Bright pink
    "bg-pink-100": "#D81B60", // Medium pink
    "bg-pink-700": "#AD1457", // Deep pink
    // Roses (High Contrast)
    "bg-rose-50": "#F06292", // Bright rose
    "bg-rose-100": "#E91E63", // Medium rose
    "bg-rose-700": "#C2185B", // Deep rose
    // Oranges (High Contrast)
    "bg-orange-50": "#FF9800", // Bright orange
    "bg-orange-100": "#FB8C00", // Medium orange
    "bg-orange-700": "#E65100", // Deep orange
    // Reds (High Contrast)
    "bg-red-50": "#F44336", // Bright red
    "bg-red-100": "#E53935", // Medium red
    "bg-red-700": "#C62828", // Deep red
    // Slates (High Contrast)
    "bg-slate-50": "#607D8B", // Bright slate
    "bg-slate-100": "#546E7A", // Medium slate
    "bg-slate-700": "#37474F", // Deep slate
    // Default (High Contrast Grays)
    "bg-gray-50": "#757575", // Bright gray
    "bg-gray-100": "#616161", // Medium gray
    "bg-gray-700": "#424242", // Deep gray
  };

  // Extract the color from the tailwind class
  return colorMap[tailwindClass] || "#455A64"; // Default to a visible blue-gray if not found
};

// Helper function to get category color for charts
const getCategoryChartColor = (category: string, isIncome: boolean): string => {
  const bgColor = isIncome
    ? getIncomeCategoryBgColor(category)
    : getExpenseCategoryBgColor(category);

  return getTailwindColorHex(bgColor);
};

// Client component that uses search params
function ReportsClientContent({
  yearsWithData,
  defaultYear,
}: ReportsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [incomeData, setIncomeData] = useState<Income[]>([]);
  const [expenseData, setExpenseData] = useState<Expense[]>([]);
  const [previousYearIncomeData, setPreviousYearIncomeData] = useState<
    Income[]
  >([]);
  const [previousYearExpenseData, setPreviousYearExpenseData] = useState<
    Expense[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Fetch data when year changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch income data for the selected year
        const incomeRes = await fetch(`/api/income?year=${selectedYear}`);
        const incomeJson = await incomeRes.json();
        setIncomeData(incomeJson);

        // Fetch expense data for the selected year
        const expenseRes = await fetch(`/api/expenses?year=${selectedYear}`);
        const expenseJson = await expenseRes.json();
        setExpenseData(expenseJson);

        // Fetch data for the previous year if it exists
        if (yearsWithData.includes(selectedYear - 1)) {
          // Fetch previous year income data
          const prevYearIncomeRes = await fetch(
            `/api/income?year=${selectedYear - 1}`
          );
          const prevYearIncomeJson = await prevYearIncomeRes.json();
          setPreviousYearIncomeData(prevYearIncomeJson);

          // Fetch previous year expense data
          const prevYearExpenseRes = await fetch(
            `/api/expenses?year=${selectedYear - 1}`
          );
          const prevYearExpenseJson = await prevYearExpenseRes.json();
          setPreviousYearExpenseData(prevYearExpenseJson);
        } else {
          // Reset previous year data if no data exists
          setPreviousYearIncomeData([]);
          setPreviousYearExpenseData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Update URL when year changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("year", selectedYear.toString());
    router.push(`/reports?${params.toString()}`);
  }, [selectedYear, router, searchParams]);

  // Calculate monthly data for the chart
  const monthlyData: MonthlyData[] = MONTHS.map((month, index) => {
    const monthIndex = index;

    // Filter income for this month
    const monthIncome = incomeData.filter((income) => {
      const date = new Date(income.date);
      return (
        date.getMonth() === monthIndex && date.getFullYear() === selectedYear
      );
    });

    // Filter expenses for this month
    const monthExpenses = expenseData.filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === monthIndex && date.getFullYear() === selectedYear
      );
    });

    // Calculate totals
    const incomeTotal = monthIncome.reduce((sum, item) => sum + item.amount, 0);
    const expenseTotal = monthExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    return {
      name: month.substring(0, 3), // Abbreviate month names
      income: incomeTotal,
      expenses: expenseTotal,
    };
  });

  // Calculate income by category
  const incomeByCategory: CategoryData[] = incomeData.reduce((acc, income) => {
    const existingCategory = acc.find((item) => item.name === income.category);
    if (existingCategory) {
      existingCategory.value += income.amount;
    } else {
      acc.push({ name: income.category, value: income.amount });
    }
    return acc;
  }, [] as CategoryData[]);

  // Calculate expenses by category
  const expensesByCategory: CategoryData[] = expenseData.reduce(
    (acc, expense) => {
      const existingCategory = acc.find(
        (item) => item.name === expense.category
      );
      if (existingCategory) {
        existingCategory.value += expense.amount;
      } else {
        acc.push({ name: expense.category, value: expense.amount });
      }
      return acc;
    },
    [] as CategoryData[]
  );

  // Sort categories by value (descending)
  incomeByCategory.sort((a, b) => b.value - a.value);
  expensesByCategory.sort((a, b) => b.value - a.value);

  // Calculate totals for current year
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  // Calculate totals for previous year
  const previousYearIncome = previousYearIncomeData.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const previousYearExpenses = previousYearExpenseData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Find highest income and expense
  const highestIncome = incomeByCategory[0] || { name: "None", value: 0 };
  const highestExpense = expensesByCategory[0] || { name: "None", value: 0 };

  // Calculate comparison with previous month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Determine if we're comparing within the selected year or need to look at previous/next years
  const isSelectedYearCurrent = selectedYear === currentYear;

  // For monthly comparison, we'll use the current month and previous month if we're in the selected year
  // Otherwise, we'll compare December with November of the selected year
  const comparisonCurrentMonth = isSelectedYearCurrent ? currentMonth : 11; // December
  const comparisonPreviousMonth = isSelectedYearCurrent
    ? currentMonth === 0
      ? 11
      : currentMonth - 1
    : 10; // Previous month or November

  // Determine the year for the previous month (might be previous year if current month is January)
  const comparisonPreviousMonthYear =
    isSelectedYearCurrent && currentMonth === 0
      ? selectedYear - 1
      : selectedYear;

  // Get month names for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthName = monthNames[comparisonCurrentMonth];
  const previousMonthName = monthNames[comparisonPreviousMonth];

  // Current month data (either current month of current year, or December of selected year)
  const currentMonthIncome = incomeData
    .filter((income) => {
      const date = new Date(income.date);
      return (
        date.getMonth() === comparisonCurrentMonth &&
        date.getFullYear() === selectedYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const currentMonthExpenses = expenseData
    .filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === comparisonCurrentMonth &&
        date.getFullYear() === selectedYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  // Previous month data
  const previousMonthIncome = incomeData
    .filter((income) => {
      const date = new Date(income.date);
      return (
        date.getMonth() === comparisonPreviousMonth &&
        date.getFullYear() === comparisonPreviousMonthYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const previousMonthExpenses = expenseData
    .filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === comparisonPreviousMonth &&
        date.getFullYear() === comparisonPreviousMonthYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  // Helper function to calculate percentage change
  const calculatePercentageChange = (
    current: number,
    previous: number
  ): number => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  };

  // Calculate percentage changes with better handling of edge cases
  const incomeMonthlyChange = calculatePercentageChange(
    currentMonthIncome,
    previousMonthIncome
  );
  const expensesMonthlyChange = calculatePercentageChange(
    currentMonthExpenses,
    previousMonthExpenses
  );

  // Calculate percentage changes with better handling of edge cases
  const incomeYearlyChange = calculatePercentageChange(
    totalIncome,
    previousYearIncome
  );
  const expensesYearlyChange = calculatePercentageChange(
    totalExpenses,
    previousYearExpenses
  );

  // Determine if we have data for the previous year
  const hasPreviousYearData = yearsWithData.includes(selectedYear - 1);

  // Determine if we have data for the current and previous months
  const hasCurrentMonthData =
    incomeData.some((income) => {
      const date = new Date(income.date);
      return (
        date.getMonth() === comparisonCurrentMonth &&
        date.getFullYear() === selectedYear
      );
    }) ||
    expenseData.some((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === comparisonCurrentMonth &&
        date.getFullYear() === selectedYear
      );
    });

  const hasPreviousMonthData =
    incomeData.some((income) => {
      const date = new Date(income.date);
      return (
        date.getMonth() === comparisonPreviousMonth &&
        date.getFullYear() === comparisonPreviousMonthYear
      );
    }) ||
    expenseData.some((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === comparisonPreviousMonth &&
        date.getFullYear() === comparisonPreviousMonthYear
      );
    });

  const hasMonthlyComparisonData = hasCurrentMonthData && hasPreviousMonthData;

  // Check if we actually have income or expense data for the previous year
  const hasPreviousYearIncomeData = previousYearIncomeData.length > 0;
  const hasPreviousYearExpenseData = previousYearExpenseData.length > 0;

  const hasYearlyComparisonData =
    (incomeData.length > 0 || expenseData.length > 0) &&
    (hasPreviousYearIncomeData || hasPreviousYearExpenseData);

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 max-w-7xl pt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Financial Reports
        </h2>

        <div className="w-full sm:w-auto">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {yearsWithData.length > 0 ? (
                yearsWithData.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={defaultYear.toString()}>
                  {defaultYear}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{totalIncome.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    ₹{totalExpenses.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Net Savings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div
                    className={`text-2xl font-bold ${
                      netSavings >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    ₹{netSavings.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Monthly Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
              <CardDescription>
                Comparison of income and expenses by month for {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-[400px] flex items-center justify-center">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#10b981" />
                      <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Highlights</CardTitle>
              <CardDescription>
                Key insights from your {selectedYear} financial data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Highest Income Source:</span>{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {highestIncome.name} (₹
                      {highestIncome.value.toLocaleString()})
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      Highest Expense Category:
                    </span>{" "}
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      {highestExpense.name} (₹
                      {highestExpense.value.toLocaleString()})
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Savings Rate:</span>{" "}
                    <span
                      className={`font-semibold ${
                        totalIncome > 0 && netSavings / totalIncome >= 0.2
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {totalIncome > 0
                        ? `${Math.round((netSavings / totalIncome) * 100)}%`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comparison Card */}
          <Card>
            <CardHeader>
              <CardTitle>Period Comparison</CardTitle>
              <CardDescription>
                {isSelectedYearCurrent
                  ? `Compare current month (${currentMonthName}) with previous month (${previousMonthName}) and ${selectedYear} with ${
                      selectedYear - 1
                    }`
                  : `Compare ${currentMonthName} with ${previousMonthName} and ${selectedYear} with ${
                      selectedYear - 1
                    }`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-3">
                      Monthly Comparison
                    </h3>
                    {!hasMonthlyComparisonData ? (
                      <div className="text-sm text-muted-foreground p-4 rounded-lg border bg-card">
                        {!hasCurrentMonthData && !hasPreviousMonthData
                          ? `No data available for ${currentMonthName} or ${previousMonthName}.`
                          : !hasCurrentMonthData
                          ? `No data available for ${currentMonthName} to compare with ${previousMonthName}.`
                          : `No data available for ${previousMonthName} to compare with ${currentMonthName}.`}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Income</span>
                            <div
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                incomeMonthlyChange > 0
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : incomeMonthlyChange < 0
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                              }`}
                            >
                              {incomeMonthlyChange > 0 ? "+" : ""}
                              {incomeMonthlyChange}%
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>
                              {currentMonthName}: ₹
                              {currentMonthIncome.toLocaleString()}
                            </span>
                            <span>
                              {previousMonthName}: ₹
                              {previousMonthIncome.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Expenses
                            </span>
                            <div
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                expensesMonthlyChange < 0
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : expensesMonthlyChange > 0
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                              }`}
                            >
                              {expensesMonthlyChange > 0 ? "+" : ""}
                              {expensesMonthlyChange}%
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>
                              {currentMonthName}: ₹
                              {currentMonthExpenses.toLocaleString()}
                            </span>
                            <span>
                              {previousMonthName}: ₹
                              {previousMonthExpenses.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-medium mb-3">
                      Yearly Comparison
                    </h3>
                    {!hasYearlyComparisonData ? (
                      <div className="text-sm text-muted-foreground p-4 rounded-lg border bg-card">
                        {!hasPreviousYearData
                          ? `No data available for ${
                              selectedYear - 1
                            } to compare with ${selectedYear}.`
                          : !hasPreviousYearIncomeData &&
                            !hasPreviousYearExpenseData
                          ? `No data available for ${
                              selectedYear - 1
                            } to compare with ${selectedYear}.`
                          : `No data available for comparison.`}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Income</span>
                            <div
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                incomeYearlyChange > 0
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : incomeYearlyChange < 0
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                              }`}
                            >
                              {incomeYearlyChange > 0 ? "+" : ""}
                              {incomeYearlyChange}%
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>
                              {selectedYear}: ₹{totalIncome.toLocaleString()}
                            </span>
                            <span>
                              {selectedYear - 1}: ₹
                              {previousYearIncome.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Expenses
                            </span>
                            <div
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                expensesYearlyChange < 0
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : expensesYearlyChange > 0
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                              }`}
                            >
                              {expensesYearlyChange > 0 ? "+" : ""}
                              {expensesYearlyChange}%
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>
                              {selectedYear}: ₹{totalExpenses.toLocaleString()}
                            </span>
                            <span>
                              {selectedYear - 1}: ₹
                              {previousYearExpenses.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Income Tab */}
        <TabsContent value="income" className="space-y-6">
          {/* Income Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Income Summary</CardTitle>
              <CardDescription>
                Breakdown of your income sources for {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-[400px] flex items-center justify-center">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="w-full h-[400px] overflow-x-auto">
                  <div className="min-w-[800px] h-full px-2">
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={incomeByCategory}
                          cx="50%"
                          cy="50%"
                          outerRadius="70%"
                          labelLine={true}
                          label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(1)}%)`
                          }
                          dataKey="value"
                        >
                          {incomeByCategory.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getCategoryChartColor(entry.name, true)}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Income Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle>Income by Category</CardTitle>
              <CardDescription>
                Detailed breakdown of income categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeByCategory.map((category, index) => (
                        <tr
                          key={index}
                          className="border-b"
                          style={{
                            backgroundColor:
                              getTailwindColorHex(
                                getIncomeCategoryBgColor(category.name)
                              ) + "20", // Adding 20 for transparency
                          }}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                  backgroundColor: getCategoryChartColor(
                                    category.name,
                                    true
                                  ),
                                }}
                              ></div>
                              {category.name}
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">
                            ₹{category.value.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4">
                            {totalIncome > 0
                              ? `${Math.round(
                                  (category.value / totalIncome) * 100
                                )}%`
                              : "0%"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6">
          {/* Expenses Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses Summary</CardTitle>
              <CardDescription>
                Breakdown of your expenses for {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-[400px] flex items-center justify-center">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="w-full h-[400px] overflow-x-auto">
                  <div className="min-w-[800px] h-full">
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          cx="50%"
                          cy="50%"
                          outerRadius="70%"
                          labelLine={true}
                          label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(1)}%)`
                          }
                          dataKey="value"
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getCategoryChartColor(entry.name, false)}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expenses Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>
                Detailed breakdown of expense categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expensesByCategory.map((category, index) => (
                        <tr
                          key={index}
                          className="border-b"
                          style={{
                            backgroundColor:
                              getTailwindColorHex(
                                getExpenseCategoryBgColor(category.name)
                              ) + "20", // Adding 20 for transparency
                          }}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                  backgroundColor: getCategoryChartColor(
                                    category.name,
                                    false
                                  ),
                                }}
                              ></div>
                              {category.name}
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">
                            ₹{category.value.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4">
                            {totalExpenses > 0
                              ? `${Math.round(
                                  (category.value / totalExpenses) * 100
                                )}%`
                              : "0%"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Wrapper component with suspense
export function ReportsClient(props: ReportsClientProps) {
  return (
    <Suspense fallback={<ReportsLoadingSkeleton />}>
      <ReportsClientContent {...props} />
    </Suspense>
  );
}

// Loading skeleton component
function ReportsLoadingSkeleton() {
  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 max-w-7xl pt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>

        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
