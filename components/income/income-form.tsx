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

export function IncomeForm({
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

      const url = isEditing ? `/api/income/${initialData.id}` : "/api/income";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message ||
          `Failed to ${isEditing ? "update" : "create"} income entry`;
        throw new Error(errorMessage);
      }

      toast.success(`Income ${isEditing ? "updated" : "added"} successfully!`);

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
                    <SelectItem value="Salary">Salary & Job</SelectItem>
                    <SelectItem value="Business">
                      Business & Start-UP
                    </SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Bonus">Bonus</SelectItem>
                    <SelectItem value="Side Hustle">Side Hustle</SelectItem>
                    <SelectItem value="Rental Income">Rental Income</SelectItem>
                    <SelectItem value="Dividends">Dividends</SelectItem>
                    <SelectItem value="Tax Refund">Tax Refund</SelectItem>
                    <SelectItem value="Government Benefits">
                      Government Benefits
                    </SelectItem>
                    <SelectItem value="Pension">Pension</SelectItem>
                    <SelectItem value="Gift">Gift</SelectItem>
                    <SelectItem value="Inheritance">Inheritance</SelectItem>
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
              ? "Update Income"
              : "Add Income"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
