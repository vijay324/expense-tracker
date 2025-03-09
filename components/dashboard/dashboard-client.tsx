"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, Calendar, IndianRupee, PiggyBank } from "lucide-react";
import { Overview } from "@/components/dashboard/overview";
import { RecentTransactions } from "@/components/dashboard/transactions";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  recentTransactions: any[];
  monthlyData: any[];
}

export function DashboardClient() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    // First, ensure the user exists in our database
    const initializeUser = async () => {
      try {
        const userResponse = await fetch("/api/user");
        if (!userResponse.ok) {
          throw new Error("Failed to initialize user");
        }

        // Now fetch dashboard data
        const dashboardResponse = await fetch("/api/dashboard");
        if (dashboardResponse.ok) {
          const data = await dashboardResponse.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Error initializing:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
        </div>

        {/* Quick Actions - still show even when loading */}
        <div className="mb-6">
          <QuickActions />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
                <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-4 animate-pulse">
            <CardHeader>
              <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-3 animate-pulse">
            <CardHeader>
              <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 w-full bg-zinc-200 dark:bg-zinc-700 rounded"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default values if data is not available
  const totalIncome = dashboardData?.totalIncome || 0;
  const totalExpenses = dashboardData?.totalExpenses || 0;
  const savingsRate = dashboardData?.savingsRate || 0;
  const netSavings = totalIncome - totalExpenses;

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-0">
          Dashboard
        </h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <QuickActions />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Income Card */}
        <Card className="overflow-hidden border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              ₹{totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalIncome > 0
                ? "Income received this year"
                : "No income recorded yet"}
            </p>
          </CardContent>
        </Card>

        {/* Total Expenses Card */}
        <Card className="overflow-hidden border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              ₹{totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalExpenses > 0
                ? "Expenses made this year"
                : "No expenses recorded yet"}
            </p>
          </CardContent>
        </Card>

        {/* Net Savings Card */}
        <Card className="overflow-hidden border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <PiggyBank className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div
              className={`text-2xl font-bold ${
                netSavings >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              ₹{netSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalIncome > 0
                ? `Savings rate: ${savingsRate}%`
                : "Add income to calculate savings"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed content for Overview and Recent Transactions */}
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-3">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="transactions">
                    Recent Transactions
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-4">
                <CardDescription className="mb-4">
                  Monthly income and expenses for the current year
                </CardDescription>
                <Overview data={dashboardData?.monthlyData || []} />
              </TabsContent>

              <TabsContent value="transactions" className="mt-4">
                <CardDescription className="mb-4">
                  Your most recent income and expense entries
                </CardDescription>
                <RecentTransactions
                  transactions={dashboardData?.recentTransactions || []}
                />
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
