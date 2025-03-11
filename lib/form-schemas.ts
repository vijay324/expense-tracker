import { z } from "zod";
import { UseFormSetError } from "react-hook-form";

// Common transaction schema for both income and expense forms
export const transactionFormSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required." })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Amount must be a valid number.",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than zero.",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Amount can have at most 2 decimal places.",
    }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  description: z
    .string()
    .max(100, { message: "Description cannot exceed 100 characters." })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  date: z
    .string()
    .min(1, { message: "Date is required." })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date.",
    })
    .refine(
      (val) => {
        const date = new Date(val);
        const now = new Date();
        return date <= now;
      },
      {
        message: "Date cannot be in the future.",
      }
    ),
});

// Common interface for form props
export interface TransactionFormProps {
  initialData?: {
    id: string;
    amount: string;
    category: string;
    description: string;
    date: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;

// Common validation and formatting function
export function validateAndFormatAmount(
  amount: string,
  setError: UseFormSetError<TransactionFormSchema>
) {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    setError("amount", {
      type: "manual",
      message: "Please enter a valid positive amount.",
    });
    return null;
  }
  return numericAmount.toFixed(2);
}
