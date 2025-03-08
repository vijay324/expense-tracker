"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  year: z
    .string()
    .min(1, { message: "Year is required." })
    .refine(
      (val) => {
        const yearNum = parseInt(val);
        const currentYear = new Date().getFullYear();
        return (
          !isNaN(yearNum) &&
          yearNum >= currentYear &&
          yearNum <= currentYear + 5
        );
      },
      { message: "Please select a valid year." }
    ),
  amount: z
    .string()
    .min(1, { message: "Amount is required." })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Budget amount must be a positive number.",
    }),
});

// Generate years from current year to current year + 5
const years = Array.from({ length: 6 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  return { value: year.toString(), label: year.toString() };
});

interface Budget {
  id: string;
  year: number;
  amount: number;
}

interface BudgetFormProps {
  initialData?: {
    id: string;
    year: string;
    amount: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BudgetForm({
  initialData,
  onSuccess,
  onCancel,
}: BudgetFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      year: new Date().getFullYear().toString(),
      amount: "",
    },
  });

  useEffect(() => {
    if (!isEditing) {
      const fetchCurrentBudget = async () => {
        try {
          const response = await fetch("/api/budget");
          if (!response.ok) {
            throw new Error("Failed to fetch budget data");
          }
          const data = await response.json();

          // Find budget for current year
          const currentYear = new Date().getFullYear();
          const budget = data.find((b: Budget) => b.year === currentYear);

          if (budget) {
            setCurrentBudget(budget);
            form.setValue("amount", budget.amount.toString());
          }
        } catch (error) {
          console.error("Error fetching budget:", error);
          toast.error("Failed to load budget data");
        }
      };

      fetchCurrentBudget();
    }
  }, [form, isEditing]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const url = isEditing ? `/api/budget/${initialData.id}` : "/api/budget";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "save"} budget`);
      }

      const data = await response.json();
      setCurrentBudget(data);

      toast.success(`Budget ${isEditing ? "updated" : "saved"} successfully!`);

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Budget (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>
                  Set your total budget for the selected year.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="mr-2"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
              ? "Update Budget"
              : currentBudget
              ? "Update Budget"
              : "Save Budget"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
