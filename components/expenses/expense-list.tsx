"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  TrendingDown,
  MoreHorizontal,
  Pencil,
  Trash,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error("Failed to fetch expense data");
        }
        const data = await response.json();
        setExpenses(data);
        setFilteredExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to load expense data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filter expenses based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredExpenses(expenses);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = expenses.filter(
      (expense) =>
        expense.category.toLowerCase().includes(query) ||
        (expense.description &&
          expense.description.toLowerCase().includes(query)) ||
        expense.amount.toString().includes(query) ||
        format(new Date(expense.date), "MMM dd, yyyy")
          .toLowerCase()
          .includes(query)
    );

    setFilteredExpenses(filtered);
  }, [searchQuery, expenses]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense entry");
      }

      const updatedExpenses = expenses.filter((item) => item.id !== id);
      setExpenses(updatedExpenses);
      setFilteredExpenses(
        updatedExpenses.filter((expense) => {
          const query = searchQuery.toLowerCase().trim();
          return (
            !query ||
            expense.category.toLowerCase().includes(query) ||
            (expense.description &&
              expense.description.toLowerCase().includes(query)) ||
            expense.amount.toString().includes(query) ||
            format(new Date(expense.date), "MMM dd, yyyy")
              .toLowerCase()
              .includes(query)
          );
        })
      );

      toast.success("Expense entry deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense entry");
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading expense data...</div>;
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-4">
        No expense entries found. Add your first expense entry!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search expenses by category, description, amount or date..."
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

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-4 border rounded-md">
          No expenses match your search. Try a different query.
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="grid grid-cols-5 bg-muted p-4 text-sm font-medium">
            <div>Date</div>
            <div>Category</div>
            <div>Description</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y">
            {filteredExpenses.map((item) => (
              <div key={item.id} className="grid grid-cols-5 items-center p-4">
                <div className="text-sm">
                  {format(new Date(item.date), "MMM dd, yyyy")}
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-rose-500 p-1 rounded-full">
                    <TrendingDown className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">{item.category}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.description || "-"}
                </div>
                <div className="text-right font-medium text-rose-500">
                  -₹{item.amount.toLocaleString()}
                </div>
                <div className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push(`/expenses/edit/${item.id}`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
