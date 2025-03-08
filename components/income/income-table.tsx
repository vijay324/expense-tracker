"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { IncomeForm } from "@/components/income/income-form";

interface Income {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string | Date;
  createdAt: string | Date;
}

interface IncomeTableProps {
  incomes: Income[];
  onEdit?: (income: Income) => void;
}

export function IncomeTable({
  incomes: initialIncomes,
  onEdit,
}: IncomeTableProps) {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState<Income | null>(null);
  const router = useRouter();

  // Fetch incomes on mount and set up interval for real-time updates
  const fetchIncomes = async () => {
    try {
      const response = await fetch("/api/income");
      if (!response.ok) {
        throw new Error("Failed to fetch income entries");
      }
      const data = await response.json();
      setIncomes(data);
    } catch (error) {
      console.error("Error fetching income:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchIncomes();

    // Set up interval for real-time updates (every 5 seconds)
    const intervalId = setInterval(fetchIncomes, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async () => {
    if (!incomeToDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/income/${incomeToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete income");
      }

      toast.success("Income deleted successfully");
      setIncomes(incomes.filter((i) => i.id !== incomeToDelete.id));
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
      setIncomeToDelete(null);
    }
  };

  const handleEdit = (income: Income) => {
    setIncomeToEdit(income);
    setIsEditing(true);
  };

  const columns = [
    {
      header: "Date",
      accessorKey: "date" as keyof Income,
      cell: (income: Income) => format(new Date(income.date), "MMM dd, yyyy"),
    },
    {
      header: "Category",
      accessorKey: "category" as keyof Income,
    },
    {
      header: "Description",
      accessorKey: "description" as keyof Income,
      cell: (income: Income) => income.description || "-",
    },
    {
      header: "Amount",
      accessorKey: "amount" as keyof Income,
      cell: (income: Income) => (
        <span className="font-medium text-green-600 dark:text-green-400">
          ₹{income.amount.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={incomes}
        columns={columns}
        itemsPerPage={5}
        onEdit={handleEdit}
        onDelete={(income) => {
          setIncomeToDelete(income);
          setIsDeleting(true);
        }}
      />

      {/* Edit Modal */}
      {isEditing && incomeToEdit && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Income</h2>
            <IncomeForm
              initialData={{
                id: incomeToEdit.id,
                amount: incomeToEdit.amount.toString(),
                category: incomeToEdit.category,
                description: incomeToEdit.description || "",
                date: new Date(incomeToEdit.date).toISOString().split("T")[0],
              }}
              onSuccess={() => {
                setIsEditing(false);
                fetchIncomes();
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
        title="Delete Income"
        description="Are you sure you want to delete this income? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isLoading}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}
