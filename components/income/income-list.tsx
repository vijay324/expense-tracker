"use client";

import { useState, useEffect } from "react";
import { IncomeItem } from "./income-item";
import { toast } from "react-hot-toast";

interface Income {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string | Date;
  createdAt: string | Date;
}

interface IncomeListProps {
  incomes: Income[];
}

export function IncomeList({ incomes: initialIncomes }: IncomeListProps) {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch incomes on mount and set up interval for real-time updates
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/income");
        if (!response.ok) {
          throw new Error("Failed to fetch income entries");
        }
        const data = await response.json();
        setIncomes(data);
      } catch (error) {
        console.error("Error fetching income:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchIncomes();

    // Set up interval for real-time updates (every 5 seconds)
    const intervalId = setInterval(fetchIncomes, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading && !incomes.length) {
    return (
      <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
        <p className="text-zinc-500 dark:text-zinc-400">
          Loading income entries...
        </p>
      </div>
    );
  }

  if (!incomes.length) {
    return (
      <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
        <p className="text-zinc-500 dark:text-zinc-400">
          No income entries found. Add your first income!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {incomes.map((income) => (
        <IncomeItem
          key={income.id}
          income={income}
          onDelete={(id) => {
            setIncomes(incomes.filter((i) => i.id !== id));
          }}
        />
      ))}
    </div>
  );
}
