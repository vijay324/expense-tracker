"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart4,
  PieChart,
} from "lucide-react";
import { Overview } from "@/components/dashboard/overview";
import { RecentTransactions } from "@/components/dashboard/transactions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  budgetAmount: number;
  budgetRemaining: number;
  savingsRate: number;
  recentTransactions: any[];
  monthlyData: any[];
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
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
  const budgetAmount = dashboardData?.budgetAmount || 0;
  const budgetRemaining = dashboardData?.budgetRemaining || 0;
  const savingsRate = dashboardData?.savingsRate || 0;

  // Calculate percentage of budget used
  const budgetPercentage =
    budgetAmount > 0
      ? Math.min(Math.round((totalExpenses / budgetAmount) * 100), 100)
      : 0;

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Income Card */}
        <Card className="overflow-hidden border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-500" />
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
              <CreditCard className="h-4 w-4 text-rose-500" />
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

        {/* Budget Remaining Card */}
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <CardTitle className="text-sm font-medium">
              Budget Remaining
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              ₹{budgetRemaining.toLocaleString()}
            </div>
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>{budgetPercentage}% used</span>
                <span>{100 - budgetPercentage}% left</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2.5 dark:bg-zinc-700">
                <div
                  className={`h-2.5 rounded-full ${
                    budgetPercentage > 90
                      ? "bg-rose-500"
                      : budgetPercentage > 70
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${budgetPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate Card */}
        <Card className="overflow-hidden border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <PieChart className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{savingsRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalIncome > 0
                ? "Of your income saved"
                : "Add income to calculate savings"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart4 className="h-4 w-4 mr-2" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            <span>Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>
                Your income and expenses for the current year
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                {dashboardData?.recentTransactions?.length
                  ? `You made ${dashboardData.recentTransactions.length} transactions recently`
                  : "No recent transactions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
