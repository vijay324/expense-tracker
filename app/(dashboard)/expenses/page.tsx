import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExpensesTable } from "@/components/expenses/expenses-table";
import { ExpenseCategories } from "@/components/expenses/expense-categories";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";
import { ExpensesClient } from "../../../components/expenses/expenses-client";
import prisma from "@/lib/db";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string | Date;
  createdAt: string | Date;
}

async function getExpenses() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return [];
    }

    // Get the user from our database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return [];
    }

    // Get all expense entries for the user
    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return expenses;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
}

async function getBudgetAmount() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return 0;
    }

    // Get the user from our database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return 0;
    }

    // Get the latest budget for the user
    const budget = await prisma.budget.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return budget?.amount || 0;
  } catch (error) {
    console.error("Error fetching budget:", error);
    return 0;
  }
}

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  const budgetAmount = await getBudgetAmount();

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <ExpensesClient
      initialExpenses={expenses}
      initialBudgetAmount={budgetAmount}
      initialTotalExpenses={totalExpenses}
    />
  );
}
