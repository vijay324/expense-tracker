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
import { Button } from "@/components/ui/button";
import { IncomeForm } from "@/components/income/income-form";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface IncomeDialogProps {
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
  showIcon?: boolean;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  isLoading?: boolean;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
}

export function IncomeDialog({
  buttonVariant = "default",
  buttonSize = "default",
  buttonText = "Add Income",
  showIcon = true,
  className = "",
  onSuccess,
  onError,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
}: IncomeDialogProps) {
  const [open, setOpen] = useState(false);
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Use external loading state if provided, otherwise use internal
  const isLoading =
    externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = externalSetIsLoading || setInternalIsLoading;

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleError = (error: any) => {
    if (onError) {
      onError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={className}
          disabled={isLoading}
        >
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
        <IncomeForm
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={() => setOpen(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
