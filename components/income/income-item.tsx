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
import { IncomeForm } from "./income-form";
import { getIncomeCategoryColor } from "@/lib/category-colors";

interface IncomeItemProps {
  income: {
    id: string;
    amount: number;
    category: string;
    description: string | null;
    date: string | Date;
    createdAt: string | Date;
  };
  onDelete?: (id: string) => void;
}

export function IncomeItem({ income, onDelete }: IncomeItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = format(new Date(income.date), "MMM dd, yyyy");

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/income/${income.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete income");
      }

      toast.success("Income deleted successfully");

      // Call the onDelete prop if provided
      if (onDelete) {
        onDelete(income.id);
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
                  className={`mb-2 ${getIncomeCategoryColor(income.category)}`}
                >
                  {income.category}
                </Badge>
                <h3 className="text-lg font-semibold">
                  ₹{income.amount.toFixed(2)}
                </h3>
                {income.description && (
                  <p className="text-sm text-zinc-500 mt-1">
                    {income.description}
                  </p>
                )}
                <p className="text-xs text-zinc-400 mt-2">{formattedDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 p-2 bg-zinc-50 dark:bg-zinc-800/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
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
        <div className="fixed inset-0 z-50 bg-black backdrop-blur-3xl flex items-center justify-center p-4">
          <div className="bg-white/75 dark:bg-zinc-800 backdrop-blur-xl rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Income</h2>
            <IncomeForm
              initialData={{
                id: income.id,
                amount: income.amount.toString(),
                category: income.category,
                description: income.description || "",
                date: new Date(income.date).toISOString().split("T")[0],
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
