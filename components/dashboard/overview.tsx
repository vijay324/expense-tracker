"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Line,
  ComposedChart,
} from "recharts";
import { toast } from "react-hot-toast";

interface MonthlyData {
  name: string;
  income: number;
  expenses: number;
}

export function Overview() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState<"bar" | "composed">("bar");
  const [viewMode, setViewMode] = useState<"all" | "current">("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const dashboardData = await response.json();
          if (
            dashboardData.monthlyData &&
            dashboardData.monthlyData.length > 0
          ) {
            setData(dashboardData.monthlyData);
          } else {
            // Use sample data if no real data is available
            setData(sampleData);
          }
        } else {
          // Use sample data if API fails
          setData(sampleData);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // Use sample data if API fails
        setData(sampleData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on view mode
  const currentMonth = new Date().getMonth();
  const displayData =
    viewMode === "current"
      ? data.slice(Math.max(0, currentMonth - 2), currentMonth + 1)
      : data;

  // Calculate totals for the legend
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-full h-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center text-sm">
            <span className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></span>
            <span className="mr-4">
              Income: ₹{totalIncome.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <span className="h-3 w-3 rounded-full bg-rose-500 mr-1"></span>
            <span>Expenses: ₹{totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center rounded-md border border-input bg-transparent p-1">
            <button
              onClick={() => setChartType("bar")}
              className={`px-2.5 py-1 text-xs rounded-sm ${
                chartType === "bar"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType("composed")}
              className={`px-2.5 py-1 text-xs rounded-sm ${
                chartType === "composed"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Line + Bar
            </button>
          </div>

          <div className="flex items-center rounded-md border border-input bg-transparent p-1">
            <button
              onClick={() => setViewMode("all")}
              className={`px-2.5 py-1 text-xs rounded-sm ${
                viewMode === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Months
            </button>
            <button
              onClick={() => setViewMode("current")}
              className={`px-2.5 py-1 text-xs rounded-sm ${
                viewMode === "current"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Recent
            </button>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart
              data={displayData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
                tickMargin={8}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="#4ade80"
                radius={[4, 4, 0, 0]}
                name="Income"
                animationDuration={1000}
              />
              <Bar
                dataKey="expenses"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                name="Expenses"
                animationDuration={1000}
              />
            </BarChart>
          ) : (
            <ComposedChart
              data={displayData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
                tickMargin={8}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="expenses"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                name="Expenses"
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4ade80"
                strokeWidth={2}
                dot={{ r: 4, fill: "#4ade80" }}
                activeDot={{ r: 6 }}
                name="Income"
                animationDuration={1000}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Sample data to use when no real data is available
const sampleData = [
  {
    name: "Jan",
    income: 0,
    expenses: 0,
  },
  {
    name: "Feb",
    income: 0,
    expenses: 0,
  },
  {
    name: "Mar",
    income: 0,
    expenses: 0,
  },
  {
    name: "Apr",
    income: 0,
    expenses: 0,
  },
  {
    name: "May",
    income: 0,
    expenses: 0,
  },
  {
    name: "Jun",
    income: 0,
    expenses: 0,
  },
  {
    name: "Jul",
    income: 0,
    expenses: 0,
  },
  {
    name: "Aug",
    income: 0,
    expenses: 0,
  },
  {
    name: "Sep",
    income: 0,
    expenses: 0,
  },
  {
    name: "Oct",
    income: 0,
    expenses: 0,
  },
  {
    name: "Nov",
    income: 0,
    expenses: 0,
  },
  {
    name: "Dec",
    income: 0,
    expenses: 0,
  },
];
