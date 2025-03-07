"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { TrendingUp, MoreHorizontal, Pencil, Trash } from "lucide-react";
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

interface Income {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export function IncomeList() {
  const [income, setIncome] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await fetch("/api/income");
        if (!response.ok) {
          throw new Error("Failed to fetch income data");
        }
        const data = await response.json();
        setIncome(data);
      } catch (error) {
        console.error("Error fetching income:", error);
        toast.error("Failed to load income data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncome();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/income/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete income entry");
      }

      setIncome(income.filter((item) => item.id !== id));
      toast.success("Income entry deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income entry");
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading income data...</div>;
  }

  if (income.length === 0) {
    return (
      <div className="text-center py-4">
        No income entries found. Add your first income entry!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-5 bg-muted p-4 text-sm font-medium">
          <div>Date</div>
          <div>Category</div>
          <div>Description</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y">
          {income.map((item) => (
            <div key={item.id} className="grid grid-cols-5 items-center p-4">
              <div className="text-sm">
                {format(new Date(item.date), "MMM dd, yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 p-1 rounded-full">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm">{item.category}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.description || "-"}
              </div>
              <div className="text-right font-medium text-emerald-500">
                ₹{item.amount.toLocaleString()}
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
                      onClick={() => router.push(`/income/edit/${item.id}`)}
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
    </div>
  );
}
