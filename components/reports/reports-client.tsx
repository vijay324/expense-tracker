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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#A4DE6C",
  "#D0ED57",
  "#FFC658",
  "#FF7300",
];

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

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  // Find highest income and expense
  const highestIncome = incomeByCategory[0] || { name: "None", value: 0 };
  const highestExpense = expensesByCategory[0] || { name: "None", value: 0 };

  // Calculate comparison with previous month
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear =
    currentMonth === 0 ? selectedYear - 1 : selectedYear;

  // Current month data
  const currentMonthIncome = incomeData
    .filter((income) => {
      const date = new Date(income.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === selectedYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const currentMonthExpenses = expenseData
    .filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === selectedYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  // Previous month data
  const previousMonthIncome = incomeData
    .filter((income) => {
      const date = new Date(income.date);
      return (
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousMonthYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const previousMonthExpenses = expenseData
    .filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousMonthYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  // Calculate percentage changes
  const incomeMonthlyChange =
    previousMonthIncome === 0
      ? 100
      : Math.round(
          ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) *
            100
        );

  const expensesMonthlyChange =
    previousMonthExpenses === 0
      ? 100
      : Math.round(
          ((currentMonthExpenses - previousMonthExpenses) /
            previousMonthExpenses) *
            100
        );

  // Calculate comparison with previous year
  const previousYearIncome = incomeData
    .filter((income) => {
      const date = new Date(income.date);
      return date.getFullYear() === selectedYear - 1;
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const previousYearExpenses = expenseData
    .filter((expense) => {
      const date = new Date(expense.date);
      return date.getFullYear() === selectedYear - 1;
    })
    .reduce((sum, item) => sum + item.amount, 0);

  // Calculate percentage changes
  const incomeYearlyChange =
    previousYearIncome === 0
      ? 100
      : Math.round(
          ((totalIncome - previousYearIncome) / previousYearIncome) * 100
        );

  const expensesYearlyChange =
    previousYearExpenses === 0
      ? 100
      : Math.round(
          ((totalExpenses - previousYearExpenses) / previousYearExpenses) * 100
        );

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
                Compare with previous month and year
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
                            Current: ₹{currentMonthIncome.toLocaleString()}
                          </span>
                          <span>
                            Previous: ₹{previousMonthIncome.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Expenses</span>
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
                            Current: ₹{currentMonthExpenses.toLocaleString()}
                          </span>
                          <span>
                            Previous: ₹{previousMonthExpenses.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-medium mb-3">
                      Yearly Comparison
                    </h3>
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
                          <span className="text-sm font-medium">Expenses</span>
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
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {incomeByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
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
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{category.name}</td>
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
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
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
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{category.name}</td>
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
