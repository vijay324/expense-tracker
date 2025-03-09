"use client";

import { useState, useEffect } from "react";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import {
  getIncomeCategoryBgColor,
  getIncomeCategoryTextColor,
  getExpenseCategoryBgColor,
  getExpenseCategoryTextColor,
  getIncomeCategoryBorderColor,
  getExpenseCategoryBorderColor,
} from "@/lib/category-colors";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  type: string;
  createdAt?: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  limit?: number;
}

export function RecentTransactions({
  transactions: propTransactions,
  limit = 10,
}: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    propTransactions || []
  );
  const [isLoading, setIsLoading] = useState(propTransactions ? false : true);

  useEffect(() => {
    if (propTransactions && propTransactions.length > 0) {
      // Sort by createdAt or date (newest first) and limit to specified number
      const sortedTransactions = [...propTransactions]
        .sort((a, b) => {
          // Use createdAt if available, otherwise use date
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.date);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, limit);

      setTransactions(sortedTransactions);
      setIsLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const data = await response.json();
          if (data.recentTransactions && data.recentTransactions.length > 0) {
            // Sort by createdAt or date (newest first) and limit to specified number
            const sortedTransactions = [...data.recentTransactions]
              .sort((a, b) => {
                // Use createdAt if available, otherwise use date
                const dateA = a.createdAt
                  ? new Date(a.createdAt)
                  : new Date(a.date);
                const dateB = b.createdAt
                  ? new Date(b.createdAt)
                  : new Date(b.date);
                return dateB.getTime() - dateA.getTime();
              })
              .slice(0, limit); // Ensure we only take the specified limit

            console.log(
              `Fetched ${data.recentTransactions.length} transactions, showing ${sortedTransactions.length}`
            );
            setTransactions(sortedTransactions);
          }
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load recent transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [propTransactions, limit]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
          <div key={i} className="flex items-center animate-pulse">
            <div className="bg-zinc-200 dark:bg-zinc-700 h-10 w-10 rounded-full mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
          <Calendar className="h-8 w-8 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Add income or expenses to see your recent transactions here.
        </p>
      </div>
    );
  }

  // Function to format date in a user-friendly way
  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else if (date.getFullYear() === new Date().getFullYear()) {
      // If it's this year, don't show the year
      return format(date, "MMM d, h:mm a");
    } else {
      // If it's a different year, show the year
      return format(date, "MMM d, yyyy, h:mm a");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {transactions.length} most recent transactions (showing up to {limit})
        </h3>
      </div>

      <div className="max-h-[500px] overflow-y-auto pr-2">
        {transactions.map((transaction) => {
          // Use createdAt if available, otherwise use date
          const dateToDisplay = transaction.createdAt || transaction.date;
          const formattedDate = formatTransactionDate(dateToDisplay);
          const timeAgo = formatDistanceToNow(new Date(dateToDisplay), {
            addSuffix: true,
          });

          // Get appropriate colors based on transaction type and category
          const bgColor =
            transaction.type === "income"
              ? getIncomeCategoryBgColor(transaction.category)
              : getExpenseCategoryBgColor(transaction.category);

          const textColor =
            transaction.type === "income"
              ? getIncomeCategoryTextColor(transaction.category)
              : getExpenseCategoryTextColor(transaction.category);

          const borderColor =
            transaction.type === "income"
              ? getIncomeCategoryBorderColor(transaction.category)
              : getExpenseCategoryBorderColor(transaction.category);

          // Icon background and text colors
          const iconBgColor =
            transaction.type === "income"
              ? `${getIncomeCategoryBgColor(transaction.category)}`
              : `${getExpenseCategoryBgColor(transaction.category)}`;

          const iconTextColor =
            transaction.type === "income"
              ? `${getIncomeCategoryTextColor(transaction.category)}`
              : `${getExpenseCategoryTextColor(transaction.category)}`;

          return (
            <div
              key={transaction.id}
              className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${iconBgColor}`}
              >
                {transaction.type === "income" ? (
                  <TrendingUp className={`h-5 w-5 ${iconTextColor}`} />
                ) : (
                  <TrendingDown className={`h-5 w-5 ${iconTextColor}`} />
                )}
              </div>

              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">
                    {transaction.description || transaction.category}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      transaction.type === "income"
                        ? "text-emerald-600 dark:text-emerald-500"
                        : "text-rose-600 dark:text-rose-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="mr-2" title={formattedDate}>
                    {timeAgo}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${bgColor} ${textColor} ${borderColor}`}
                  >
                    {transaction.category}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
