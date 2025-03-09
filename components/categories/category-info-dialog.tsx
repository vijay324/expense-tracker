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
import { InfoIcon, CircleIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getIncomeCategoryBgColor,
  getIncomeCategoryTextColor,
  getIncomeCategoryBorderColor,
  getExpenseCategoryBgColor,
  getExpenseCategoryTextColor,
  getExpenseCategoryBorderColor,
} from "@/lib/category-colors";

interface CategoryInfoDialogProps {
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
}

export function CategoryInfoDialog({
  buttonVariant = "outline",
  buttonSize = "default",
  buttonText = "Learn About Categories",
  showIcon = true,
  className = "",
}: CategoryInfoDialogProps) {
  const [open, setOpen] = useState(false);

  // Income categories
  const incomeCategories = [
    {
      name: "Salary",
      description:
        "Regular income from employment, typically paid on a fixed schedule.",
    },
    {
      name: "Freelance",
      description:
        "Income earned from contract or freelance work on a project basis.",
    },
    {
      name: "Investment",
      description:
        "Returns from stocks, bonds, mutual funds, or other investment vehicles.",
    },
    {
      name: "Bonus",
      description:
        "Additional compensation beyond regular salary, often performance-based.",
    },
    {
      name: "Side Hustle",
      description: "Income from secondary jobs or entrepreneurial activities.",
    },
    {
      name: "Rental Income",
      description: "Money received from renting property or assets to others.",
    },
    {
      name: "Dividends",
      description: "Distributions of profits from companies to shareholders.",
    },
    {
      name: "Tax Refund",
      description: "Money returned from tax authorities due to overpayment.",
    },
    {
      name: "Government Benefits",
      description: "Income from government assistance programs or benefits.",
    },
    {
      name: "Pension",
      description:
        "Regular payments received during retirement from pension plans.",
    },
    {
      name: "Gift",
      description: "Money received as a gift from family, friends, or others.",
    },
    {
      name: "Inheritance",
      description: "Assets or money received from a deceased person's estate.",
    },
  ];

  // Expense categories
  const expenseCategories = [
    {
      name: "Housing",
      description:
        "Rent, mortgage payments, property taxes, and home insurance.",
    },
    {
      name: "Food",
      description:
        "General food expenses that don't fit into more specific categories.",
    },
    {
      name: "Groceries",
      description: "Food and household items purchased from grocery stores.",
    },
    {
      name: "Restaurant & Dining Out",
      description: "Meals purchased at restaurants, cafes, and food delivery.",
    },
    {
      name: "Transportation",
      description:
        "Car payments, fuel, public transit, rideshares, and vehicle maintenance.",
    },
    {
      name: "Utilities",
      description:
        "Electricity, water, gas, internet, and other home utilities.",
    },
    {
      name: "Bills & Recharge",
      description: "Mobile phone bills, subscriptions, and service recharges.",
    },
    {
      name: "Healthcare",
      description:
        "Medical expenses, doctor visits, medications, and health insurance.",
    },
    {
      name: "Insurance",
      description: "Life, health, auto, and other insurance premiums.",
    },
    {
      name: "Debt Payments",
      description:
        "Credit card payments, loan repayments, and other debt servicing.",
    },
    {
      name: "Entertainment",
      description:
        "Movies, concerts, streaming services, and other leisure activities.",
    },
    {
      name: "Shopping",
      description: "Clothing, electronics, and other retail purchases.",
    },
    {
      name: "Subscriptions",
      description:
        "Regular payments for digital services, memberships, and subscriptions.",
    },
    {
      name: "Education",
      description: "Tuition, books, courses, and other educational expenses.",
    },
    {
      name: "Personal Care",
      description:
        "Haircuts, spa services, cosmetics, and personal hygiene products.",
    },
    {
      name: "Travel",
      description:
        "Vacations, flights, hotels, and other travel-related expenses.",
    },
    {
      name: "Gifts & Donations",
      description: "Presents for others and charitable contributions.",
    },
    {
      name: "Childcare",
      description: "Daycare, babysitting, and other child-related expenses.",
    },
    {
      name: "Home Maintenance",
      description: "Repairs, renovations, and upkeep of your home.",
    },
    { name: "Clothing", description: "Apparel, shoes, and accessories." },
    {
      name: "Taxes",
      description: "Income tax, property tax, and other tax payments.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {showIcon && <InfoIcon className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Understanding Categories</DialogTitle>
          <DialogDescription>
            Learn about the different categories for income and expenses
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Income Categories
              </h3>
              <div className="space-y-4">
                {incomeCategories.map((category) => {
                  const bgColor = getIncomeCategoryBgColor(category.name);
                  const textColor = getIncomeCategoryTextColor(category.name);
                  const borderColor = getIncomeCategoryBorderColor(
                    category.name
                  );

                  return (
                    <div
                      key={category.name}
                      className={`p-3 rounded-md border-l-4 ${borderColor} bg-background/50`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${bgColor}`}
                        ></div>
                        <span className={`${textColor} font-medium`}>
                          {category.name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 ml-5">
                        {category.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Expense Categories
              </h3>
              <div className="space-y-4">
                {expenseCategories.map((category) => {
                  const bgColor = getExpenseCategoryBgColor(category.name);
                  const textColor = getExpenseCategoryTextColor(category.name);
                  const borderColor = getExpenseCategoryBorderColor(
                    category.name
                  );

                  return (
                    <div
                      key={category.name}
                      className={`p-3 rounded-md border-l-4 ${borderColor} bg-background/50`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${bgColor}`}
                        ></div>
                        <span className={`${textColor} font-medium`}>
                          {category.name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 ml-5">
                        {category.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Tips for Categorizing
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>
                  Be consistent with your categorization to get accurate
                  insights over time.
                </li>
                <li>
                  Use the most specific category that applies to each
                  transaction.
                </li>
                <li>
                  Consider creating a budget for each major category to track
                  spending limits.
                </li>
                <li>
                  Review your category usage periodically to ensure it still
                  matches your financial habits.
                </li>
                <li>
                  For mixed purchases (like at a supermarket), consider
                  splitting the transaction or using the predominant category.
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
