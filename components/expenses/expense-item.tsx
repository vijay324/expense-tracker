"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ExpenseForm } from "./expense-form";
import { getExpenseCategoryColor } from "@/lib/category-colors";

interface ExpenseItemProps {
  expense: {
    id: string;
    amount: number;
    category: string;
    description: string | null;
    date: string | Date;
    createdAt: string | Date;
  };
  onDelete?: (id: string) => void;
}

export function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = format(new Date(expense.date), "MMM dd, yyyy");

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      toast.success("Expense deleted successfully");

      // Call the onDelete prop if provided
      if (onDelete) {
        onDelete(expense.id);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <Badge
                  className={`mb-2 ${getExpenseCategoryColor(
                    expense.category
                  )}`}
                >
                  {expense.category}
                </Badge>
                <h3 className="text-lg font-semibold">
                  ₹{expense.amount.toFixed(2)}
                </h3>
                {expense.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {expense.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">{formattedDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 p-2 bg-gray-50 dark:bg-gray-800/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleting(true)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>
            <ExpenseForm
              initialData={{
                id: expense.id,
                amount: expense.amount.toString(),
                category: expense.category,
                description: expense.description || "",
                date: new Date(expense.date).toISOString().split("T")[0],
              }}
              onSuccess={() => {
                setIsEditing(false);
                router.refresh();
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
