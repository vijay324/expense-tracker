"use client";

import { useState, useEffect } from "react";
import { BudgetItem } from "./budget-item";
import { toast } from "react-hot-toast";

interface Budget {
  id: string;
  year: number;
  amount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface BudgetListProps {
  budgets: Budget[];
}

export function BudgetList({ budgets: initialBudgets }: BudgetListProps) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch budgets on mount and set up interval for real-time updates
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/budget");
        if (!response.ok) {
          throw new Error("Failed to fetch budgets");
        }
        const data = await response.json();
        setBudgets(data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchBudgets();

    // Set up interval for real-time updates (every 5 seconds)
    const intervalId = setInterval(fetchBudgets, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading && !budgets.length) {
    return (
      <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
        <p className="text-zinc-500 dark:text-zinc-400">Loading budgets...</p>
      </div>
    );
  }

  if (!budgets.length) {
    return (
      <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
        <p className="text-zinc-500 dark:text-zinc-400">
          No budgets found. Add your first budget!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {budgets.map((budget) => (
        <BudgetItem
          key={budget.id}
          budget={budget}
          onDelete={(id) => {
            setBudgets(budgets.filter((b) => b.id !== id));
          }}
        />
      ))}
    </div>
  );
}
