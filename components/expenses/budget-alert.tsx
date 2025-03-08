"use client";

import { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BudgetAlertProps {
  totalExpenses: number;
  budgetAmount: number;
}

export function BudgetAlert({ totalExpenses, budgetAmount }: BudgetAlertProps) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (budgetAmount > 0) {
      setPercentage(
        Math.min(Math.round((totalExpenses / budgetAmount) * 100), 100)
      );
    } else {
      setPercentage(0);
    }
  }, [totalExpenses, budgetAmount]);

  if (budgetAmount === 0) {
    return (
      <Alert
        variant="default"
        className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950/30"
      >
        <Info className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-700 dark:text-blue-300">
          No Budget Set
        </AlertTitle>
        <AlertDescription className="text-blue-600 dark:text-blue-400">
          You haven't set a budget yet. Set a budget to track your spending.
          <p className="mt-2 italic text-sm">
            "A budget is telling your money where to go instead of wondering
            where it went."
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  // Define alert configurations based on percentage ranges
  const getAlertConfig = () => {
    if (percentage >= 100) {
      return {
        variant: "destructive",
        borderColor: "border-red-600",
        bgColor: "bg-red-100 dark:bg-red-950/50",
        textColor: "text-red-800 dark:text-red-200",
        iconComponent: AlertCircle,
        iconColor: "text-red-600 dark:text-red-400",
        title: "BUDGET EXCEEDED! STOP SPENDING!",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "EMERGENCY: Your financial health is at serious risk! Cut all non-essential spending immediately!",
      };
    }

    if (percentage >= 90) {
      return {
        variant: "destructive",
        borderColor: "border-red-500",
        bgColor: "bg-red-50 dark:bg-red-950/40",
        textColor: "text-red-700 dark:text-red-300",
        iconComponent: AlertCircle,
        iconColor: "text-red-500 dark:text-red-400",
        title: "Critical Budget Alert!",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "URGENT: You're about to exceed your budget! Stop all unnecessary spending now!",
      };
    }

    if (percentage >= 80) {
      return {
        variant: "default",
        borderColor: "border-red-400",
        bgColor: "bg-red-50/80 dark:bg-red-950/30",
        textColor: "text-red-600 dark:text-red-300",
        iconComponent: AlertTriangle,
        iconColor: "text-red-500 dark:text-red-400",
        title: "Severe Budget Warning",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "Your spending is dangerously high! Carefully review all expenses and cut back immediately.",
      };
    }

    if (percentage >= 70) {
      return {
        variant: "default",
        borderColor: "border-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
        textColor: "text-amber-800 dark:text-amber-300",
        iconComponent: AlertTriangle,
        iconColor: "text-amber-600 dark:text-amber-400",
        title: "High Budget Alert",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "Your spending is accelerating too quickly! Time to seriously limit your expenses.",
      };
    }

    if (percentage >= 60) {
      return {
        variant: "default",
        borderColor: "border-amber-500",
        bgColor: "bg-amber-50/80 dark:bg-amber-950/30",
        textColor: "text-amber-700 dark:text-amber-300",
        iconComponent: AlertTriangle,
        iconColor: "text-amber-500 dark:text-amber-400",
        title: "Budget Warning",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "You're spending too fast! Start cutting back on non-essential purchases now.",
      };
    }

    if (percentage >= 50) {
      return {
        variant: "default",
        borderColor: "border-amber-400",
        bgColor: "bg-amber-50/60 dark:bg-amber-950/20",
        textColor: "text-amber-600 dark:text-amber-300",
        iconComponent: Info,
        iconColor: "text-amber-500 dark:text-amber-400",
        title: "Halfway Budget Alert",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "You've used half your budget! Be more careful with your spending from now on.",
      };
    }

    if (percentage >= 40) {
      return {
        variant: "default",
        borderColor: "border-yellow-400",
        bgColor: "bg-yellow-50/50 dark:bg-yellow-950/20",
        textColor: "text-yellow-700 dark:text-yellow-300",
        iconComponent: Info,
        iconColor: "text-yellow-500 dark:text-yellow-400",
        title: "Budget Caution",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "Your spending is picking up pace. Consider ways to reduce expenses.",
      };
    }

    if (percentage >= 30) {
      return {
        variant: "default",
        borderColor: "border-blue-400",
        bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
        textColor: "text-blue-600 dark:text-blue-300",
        iconComponent: Info,
        iconColor: "text-blue-500 dark:text-blue-400",
        title: "Budget Notice",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "Keep an eye on your spending. Remember to prioritize needs over wants.",
      };
    }

    if (percentage >= 20) {
      return {
        variant: "default",
        borderColor: "border-blue-400",
        bgColor: "bg-blue-50/40 dark:bg-blue-950/20",
        textColor: "text-blue-600 dark:text-blue-300",
        iconComponent: Info,
        iconColor: "text-blue-400 dark:text-blue-300",
        title: "Budget Update",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "You're managing your budget well. Continue to be mindful of unnecessary expenses.",
      };
    }

    if (percentage >= 10) {
      return {
        variant: "default",
        borderColor: "border-green-400",
        bgColor: "bg-green-50/50 dark:bg-green-950/20",
        textColor: "text-green-600 dark:text-green-300",
        iconComponent: CheckCircle2,
        iconColor: "text-green-500 dark:text-green-400",
        title: "Budget On Track",
        message: `You've spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
        quote:
          "Good start to your budget period. Remember to save and avoid impulse purchases.",
      };
    }

    // Default for < 10%
    return {
      variant: "default",
      borderColor: "border-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      textColor: "text-green-700 dark:text-green-300",
      iconComponent: CheckCircle2,
      iconColor: "text-green-500 dark:text-green-400",
      title: "Excellent Budget Management",
      message: `You've only spent ${percentage}% of your budget (₹${totalExpenses.toLocaleString()} of ₹${budgetAmount.toLocaleString()}).`,
      quote:
        "You're doing great with your spending! Keep up the good habits and continue to save.",
    };
  };

  const alertConfig = getAlertConfig();
  const IconComponent = alertConfig.iconComponent;

  return (
    <Alert
      variant={alertConfig.variant as any}
      className={`mb-6 ${alertConfig.borderColor} ${alertConfig.bgColor}`}
    >
      <IconComponent className={`h-5 w-5 ${alertConfig.iconColor}`} />
      <AlertTitle className={alertConfig.textColor}>
        {alertConfig.title}
      </AlertTitle>
      <AlertDescription className={alertConfig.textColor}>
        {alertConfig.message}
        <p
          className={`mt-2 italic text-sm font-medium ${
            percentage >= 90 ? "text-red-600 dark:text-red-400 font-bold" : ""
          }`}
        >
          {alertConfig.quote}
        </p>
      </AlertDescription>
    </Alert>
  );
}
