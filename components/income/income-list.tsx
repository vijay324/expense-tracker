"use client";

import { useState, useEffect } from "react";
import { IncomeItem } from "./income-item";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
  const [filteredIncomes, setFilteredIncomes] =
    useState<Income[]>(initialIncomes);
  const [searchQuery, setSearchQuery] = useState("");
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
        setFilteredIncomes(data);
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

  // Filter incomes based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredIncomes(incomes);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = incomes.filter(
      (income) =>
        income.category.toLowerCase().includes(query) ||
        (income.description &&
          income.description.toLowerCase().includes(query)) ||
        income.amount.toString().includes(query) ||
        (typeof income.date === "string"
          ? income.date.toLowerCase().includes(query)
          : new Date(income.date)
              .toLocaleDateString()
              .toLowerCase()
              .includes(query))
    );

    setFilteredIncomes(filtered);
  }, [searchQuery, incomes]);

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
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search income by category, description, amount or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            onClick={() => setSearchQuery("")}
            className="text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {filteredIncomes.length === 0 ? (
        <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <p className="text-zinc-500 dark:text-zinc-400">
            No income entries match your search. Try a different query.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredIncomes.map((income) => (
            <IncomeItem
              key={income.id}
              income={income}
              onDelete={(id) => {
                const updatedIncomes = incomes.filter((i) => i.id !== id);
                setIncomes(updatedIncomes);

                // Also update filtered incomes
                if (searchQuery.trim()) {
                  const query = searchQuery.toLowerCase().trim();
                  setFilteredIncomes(
                    updatedIncomes.filter(
                      (income) =>
                        income.category.toLowerCase().includes(query) ||
                        (income.description &&
                          income.description.toLowerCase().includes(query)) ||
                        income.amount.toString().includes(query) ||
                        (typeof income.date === "string"
                          ? income.date.toLowerCase().includes(query)
                          : new Date(income.date)
                              .toLocaleDateString()
                              .toLowerCase()
                              .includes(query))
                    )
                  );
                } else {
                  setFilteredIncomes(updatedIncomes);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
