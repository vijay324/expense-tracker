"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { IncomeForm } from "@/components/income/income-form";
import { Plus } from "lucide-react";

interface IncomeDialogProps {
  buttonVariant?: ButtonProps["variant"];
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
  showIcon?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export function IncomeDialog({
  buttonVariant = "default",
  buttonSize = "default",
  buttonText = "Add Income",
  showIcon = true,
  className = "",
  onSuccess,
}: IncomeDialogProps) {
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
          <DialogTitle>Add New Income</DialogTitle>
          <DialogDescription>
            Enter the details of your income below.
          </DialogDescription>
        </DialogHeader>
        <IncomeForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
