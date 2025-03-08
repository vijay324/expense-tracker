"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ExpenseForm } from "@/components/expenses/expense-form";

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
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const router = useRouter();

  // Fetch expenses on mount and set up interval for real-time updates
  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      setExpenses(data);
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

  const columns = [
    {
      header: "Date",
      accessorKey: "date" as keyof Expense,
      cell: (expense: Expense) =>
        format(new Date(expense.date), "MMM dd, yyyy"),
    },
    {
      header: "Category",
      accessorKey: "category" as keyof Expense,
    },
    {
      header: "Description",
      accessorKey: "description" as keyof Expense,
      cell: (expense: Expense) => expense.description || "-",
    },
    {
      header: "Amount",
      accessorKey: "amount" as keyof Expense,
      cell: (expense: Expense) => (
        <span className="font-medium">₹{expense.amount.toFixed(2)}</span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={expenses}
        columns={columns}
        itemsPerPage={5}
        onEdit={handleEdit}
        onDelete={(expense) => {
          setExpenseToDelete(expense);
          setIsDeleting(true);
        }}
      />

      {/* Edit Modal */}
      {isEditing && expenseToEdit && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
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
    </>
  );
}
