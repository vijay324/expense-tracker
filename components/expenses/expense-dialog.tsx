"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { Plus } from "lucide-react";

interface ExpenseDialogProps {
  buttonVariant?: ButtonProps["variant"];
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
  showIcon?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export function ExpenseDialog({
  buttonVariant = "default",
  buttonSize = "default",
  buttonText = "Add Expense",
  showIcon = true,
  className = "",
  onSuccess,
}: ExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {showIcon && <Plus className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Enter the details of your expense below.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
