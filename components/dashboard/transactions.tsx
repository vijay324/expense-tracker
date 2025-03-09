"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  type: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export function RecentTransactions({
  transactions: propTransactions,
}: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    propTransactions || []
  );
  const [isLoading, setIsLoading] = useState(propTransactions ? false : true);

  useEffect(() => {
    if (propTransactions && propTransactions.length > 0) {
      setTransactions(propTransactions);
      setIsLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const data = await response.json();
          if (data.recentTransactions && data.recentTransactions.length > 0) {
            setTransactions(data.recentTransactions);
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
  }, [propTransactions]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
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

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const formattedDate = format(
          new Date(transaction.date),
          "MMM dd, yyyy"
        );

        return (
          <div
            key={transaction.id}
            className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div
              className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                transaction.type === "income" ? "bg-emerald-100" : "bg-rose-100"
              }`}
            >
              {transaction.type === "income" ? (
                <TrendingUp className={`h-5 w-5 text-emerald-500`} />
              ) : (
                <TrendingDown className={`h-5 w-5 text-rose-500`} />
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
                <span className="mr-2">{formattedDate}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    transaction.type === "income"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                  }`}
                >
                  {transaction.category}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
