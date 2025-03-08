"use client";

import { useState, useEffect } from "react";
import { ExpenseItem } from "./expense-item";
import { toast } from "react-hot-toast";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string | Date;
  createdAt: string | Date;
}

interface ExpensesListProps {
  expenses: Expense[];
}

export function ExpensesList({ expenses: initialExpenses }: ExpensesListProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch expenses on mount and set up interval for real-time updates
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchExpenses();

    // Set up interval for real-time updates (every 5 seconds)
    const intervalId = setInterval(fetchExpenses, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading && !expenses.length) {
    return (
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Loading expenses...</p>
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No expenses found. Add your first expense!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onDelete={(id) => {
            setExpenses(expenses.filter((e) => e.id !== id));
          }}
        />
      ))}
    </div>
  );
}
