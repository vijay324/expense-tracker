"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Edit, Trash2, ArrowUpDown, Filter, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getExpenseCategoryColor } from "@/lib/category-colors";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string | Date;
  createdAt: string | Date;
}

interface ExpensesTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
}

export function ExpensesTable({
  expenses: initialExpenses,
  onEdit,
}: ExpensesTableProps) {
  // Sort initial expenses by date (most recent first)
  const sortedInitialExpenses = [...initialExpenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const [expenses, setExpenses] = useState<Expense[]>(sortedInitialExpenses);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting state
  const [sortField, setSortField] = useState<keyof Expense>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtering state
  const [filters, setFilters] = useState<{
    category: string;
    minAmount: string;
    maxAmount: string;
    startDate: string;
    endDate: string;
  }>({
    category: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  const router = useRouter();

  // Get unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    expenses.forEach((expense) => categories.add(expense.category));
    return Array.from(categories).sort();
  }, [expenses]);

  // Fetch expenses on mount and set up interval for real-time updates
  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      // Sort fetched data by date (most recent first)
      const sortedData = [...data].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setExpenses(sortedData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchExpenses();

    // Set up interval for real-time updates (every 5 seconds)
    const intervalId = setInterval(fetchExpenses, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async () => {
    if (!expenseToDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/expenses/${expenseToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      toast.success("Expense deleted successfully");
      setExpenses(expenses.filter((e) => e.id !== expenseToDelete.id));
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
      setExpenseToDelete(null);
    }
  };

  const handleEdit = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsEditing(true);
  };

  // Handle sorting
  const handleSort = (field: keyof Expense) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to descending for dates, ascending for others
      setSortField(field);
      setSortDirection(field === "date" ? "desc" : "asc");
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
    });
  };

  // Apply sorting, filtering, and searching
  const filteredAndSortedExpenses = useMemo(() => {
    // First apply search
    let result = [...expenses];

    // Apply search query if it exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (expense) =>
          expense.category.toLowerCase().includes(query) ||
          (expense.description &&
            expense.description.toLowerCase().includes(query)) ||
          expense.amount.toString().includes(query) ||
          format(new Date(expense.date), "MMM dd, yyyy")
            .toLowerCase()
            .includes(query)
      );
    }

    // Then apply filters
    // Filter by category
    if (filters.category) {
      result = result.filter(
        (expense) => expense.category === filters.category
      );
    }

    // Filter by amount range
    if (filters.minAmount) {
      result = result.filter(
        (expense) => expense.amount >= parseFloat(filters.minAmount)
      );
    }

    if (filters.maxAmount) {
      result = result.filter(
        (expense) => expense.amount <= parseFloat(filters.maxAmount)
      );
    }

    // Filter by date range
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter((expense) => new Date(expense.date) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter((expense) => new Date(expense.date) <= endDate);
    }

    // Then apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle different types of values
      if (sortField === "date" || sortField === "createdAt") {
        const aDate = new Date(aValue as string | Date).getTime();
        const bDate = new Date(bValue as string | Date).getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      } else if (sortField === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else {
        // String comparison for other fields
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        return sortDirection === "asc"
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      }
    });

    return result;
  }, [expenses, sortField, sortDirection, filters, searchQuery]);

  // Get sort indicator
  const getSortIndicator = (field: keyof Expense) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  const columns = [
    {
      header: `Date${getSortIndicator("date")}`,
      accessorKey: "date" as keyof Expense,
      cell: (expense: Expense) =>
        format(new Date(expense.date), "MMM dd, yyyy"),
    },
    {
      header: `Amount${getSortIndicator("amount")}`,
      accessorKey: "amount" as keyof Expense,
      cell: (expense: Expense) => (
        <span className="font-medium text-red-600 dark:text-red-400">
          ₹{expense.amount.toFixed(2)}
        </span>
      ),
    },
    {
      header: `Category${getSortIndicator("category")}`,
      accessorKey: "category" as keyof Expense,
      cell: (expense: Expense) => (
        <Badge
          className={`${getExpenseCategoryColor(
            expense.category
          )} inline-block max-w-[150px] truncate`}
        >
          {expense.category}
        </Badge>
      ),
    },
    {
      header: `Description${getSortIndicator("description")}`,
      accessorKey: "description" as keyof Expense,
      cell: (expense: Expense) => (
        <span className="inline-block max-w-[200px] truncate">
          {expense.description || "-"}
        </span>
      ),
    },
  ];

  // Active filters count for badge
  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== ""
  ).length;

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search expenses by any field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>

        <div className="flex gap-2">
          {/* Sorting dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("date")}>
                Date{" "}
                {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("amount")}>
                Amount{" "}
                {sortField === "amount" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("category")}>
                Category{" "}
                {sortField === "category" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
                {Object.values(filters).some((v) => v) && (
                  <Badge variant="secondary" className="ml-1 px-1">
                    {Object.values(filters).filter((v) => v).length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Expenses</h4>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-md"
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  >
                    <option value="">All Categories</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Min Amount</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      placeholder="0"
                      value={filters.minAmount}
                      onChange={(e) =>
                        handleFilterChange("minAmount", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Max Amount</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      placeholder="1000"
                      value={filters.maxAmount}
                      onChange={(e) =>
                        handleFilterChange("maxAmount", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Show message when no results */}
      {filteredAndSortedExpenses.length === 0 ? (
        <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <p className="text-zinc-500 dark:text-zinc-400">
            No expenses match your search or filters. Try different criteria.
          </p>
        </div>
      ) : (
        <DataTable
          data={filteredAndSortedExpenses}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(expense) => {
            setExpenseToDelete(expense);
            setIsDeleting(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {isEditing && expenseToEdit && (
        <div className="fixed inset-0 z-50  bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg drop-shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>
            <ExpenseForm
              initialData={{
                id: expenseToEdit.id,
                amount: expenseToEdit.amount.toString(),
                category: expenseToEdit.category,
                description: expenseToEdit.description || "",
                date: new Date(expenseToEdit.date).toISOString().split("T")[0],
              }}
              onSuccess={() => {
                setIsEditing(false);
                fetchExpenses();
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={isDeleting}
        onOpenChange={setIsDeleting}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isLoading}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
