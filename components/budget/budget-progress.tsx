"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const COLORS = ["#f43f5e", "#4ade80"];

export function BudgetProgress() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Loading budget data...</div>;
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-4">
        No budget data available. Please set a budget first.
      </div>
    );
  }

  const { totalExpenses, budgetAmount, budgetRemaining, savingsRate } =
    dashboardData;
  const currentYear = new Date().getFullYear();

  // Calculate percentage spent
  const percentSpent =
    budgetAmount > 0 ? Math.round((totalExpenses / budgetAmount) * 100) : 0;

  // Prepare data for pie chart
  const data = [
    { name: "Spent", value: totalExpenses },
    { name: "Remaining", value: budgetRemaining > 0 ? budgetRemaining : 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Budget for {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{budgetAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Annual budget allocation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Budget Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percentSpent}%</div>
            <div className="mt-4 h-2 w-full rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${percentSpent > 100 ? 100 : percentSpent}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Budget Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Budget Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-rose-500" />
                  <span>Spent</span>
                </div>
                <span className="font-medium text-rose-500">
                  ₹{totalExpenses.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-emerald-500" />
                  <span>Remaining</span>
                </div>
                <span className="font-medium text-emerald-500">
                  ₹
                  {(budgetRemaining > 0 ? budgetRemaining : 0).toLocaleString()}
                </span>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  You have spent {percentSpent}% of your annual budget.
                  {percentSpent > 90
                    ? " You're close to exceeding your budget!"
                    : " Keep tracking your expenses to stay within budget."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
