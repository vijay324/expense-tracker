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
  year: z.string().min(1, {
    message: "Year is required.",
  }),
  amount: z.string().min(1, {
    message: "Amount is required.",
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

export function BudgetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: new Date().getFullYear().toString(),
      amount: "",
    },
  });

  useEffect(() => {
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
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to save budget");
      }

      const data = await response.json();
      setCurrentBudget(data);

      toast.success("Budget saved successfully!");
      router.refresh();
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
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : currentBudget
            ? "Update Budget"
            : "Save Budget"}
        </Button>
      </form>
    </Form>
  );
}
