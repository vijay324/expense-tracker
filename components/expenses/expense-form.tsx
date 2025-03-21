"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import {
  transactionFormSchema,
  TransactionFormProps,
  TransactionFormSchema,
  validateAndFormatAmount,
} from "@/lib/form-schemas";

export function ExpenseForm({
  initialData,
  onSuccess,
  onCancel,
}: TransactionFormProps = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );

  const isEditing = !!initialData?.id;

  const form = useForm<TransactionFormSchema>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: initialData?.amount || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      date: initialData?.date || format(new Date(), "yyyy-MM-dd"),
    },
  });

  // Update the form date field when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      form.setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, form]);

  async function onSubmit(values: TransactionFormSchema) {
    setIsLoading(true);

    try {
      // Validate amount as a number before sending
      const formattedAmount = validateAndFormatAmount(
        values.amount,
        form.setError
      );
      if (!formattedAmount) {
        setIsLoading(false);
        return;
      }

      // Format the values before sending
      const formattedValues = {
        ...values,
        amount: formattedAmount,
      };

      const endpoint = isEditing
        ? `/api/expenses/${initialData.id}`
        : "/api/expenses";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Failed to save expense";
        throw new Error(errorMessage);
      }

      toast.success(`Expense ${isEditing ? "updated" : "added"} successfully!`);

      if (onSuccess) {
        onSuccess();
      } else {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Bills & Recharge">
                      Bills & Recharge
                    </SelectItem>
                    <SelectItem value="Business Investments">
                      Business Investments
                    </SelectItem>
                    <SelectItem value="Education">
                      Education & courses
                    </SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Restaurant & Dining Out">
                      Restaurant & Dining Out
                    </SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Debt Payments">Debt Payments</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="Personal Care">Personal Care</SelectItem>
                    <SelectItem value="Gifts & Donations">
                      Gifts & Donations
                    </SelectItem>
                    <SelectItem value="Childcare">Childcare</SelectItem>
                    <SelectItem value="Home Maintenance">
                      Home Maintenance
                    </SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Taxes">Taxes</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <div className="flex flex-col space-y-1">
                    <DatePicker
                      date={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          field.onChange(format(date, "yyyy-MM-dd"));
                        }
                      }}
                    />
                    <Input type="hidden" {...field} />
                  </div>
                </FormControl>
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
                : "Adding..."
              : isEditing
              ? "Update Expense"
              : "Add Expense"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
