import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { ExpensesClient } from "../../../components/expenses/expenses-client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

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

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return <ExpensesClient initialExpenses={expenses} />;
}
