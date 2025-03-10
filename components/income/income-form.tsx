"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

const formSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required." })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Amount must be a valid number.",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than zero.",
    })
    .refine(
      (val) => {
        const decimalPlaces = val.includes(".") ? val.split(".")[1].length : 0;
        return decimalPlaces <= 2;
      },
      {
        message: "Amount cannot have more than 2 decimal places.",
      }
    )
    .refine((val) => parseFloat(val) <= 1000000, {
      message: "Amount cannot exceed 1,000,000.",
    }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  description: z
    .string()
    .max(100, { message: "Description cannot exceed 100 characters." })
    .refine((val) => !val || !/^\s+$/.test(val), {
      message: "Description cannot contain only whitespace.",
    })
    .optional(),
  date: z
    .string()
    .min(1, { message: "Date is required." })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date.",
    })
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Date cannot be more than 5 years in the past
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(today.getFullYear() - 5);
        fiveYearsAgo.setHours(0, 0, 0, 0);

        // Date cannot be more than 1 year in the future
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(today.getFullYear() + 1);
        oneYearFromNow.setHours(0, 0, 0, 0);

        return selectedDate >= fiveYearsAgo && selectedDate <= oneYearFromNow;
      },
      {
        message:
          "Date must be within the last 5 years and not more than 1 year in the future.",
      }
    ),
});

interface IncomeFormProps {
  initialData?: {
    id: string;
    amount: string;
    category: string;
    description: string;
    date: string;
  };
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
}

export function IncomeForm({
  initialData,
  onSuccess,
  onError,
  onCancel,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
}: IncomeFormProps = {}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Use external loading state if provided, otherwise use internal
  const isLoading =
    externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = externalSetIsLoading || setInternalIsLoading;

  const isEditing = !!initialData?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const url = isEditing ? `/api/income/${initialData.id}` : "/api/income";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-app-origin": window.location.origin,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error ||
            `Failed to ${isEditing ? "update" : "create"} income entry`
        );
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

      if (onError) {
        onError(error);
      }
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
        <div className="flex justify-end gap-2 mt-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2">
                  {isEditing ? "Updating..." : "Saving..."}
                </span>
                {/* You can add a spinner here if you have one */}
              </>
            ) : (
              <>{isEditing ? "Update" : "Save"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
