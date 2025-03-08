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
import prisma from "@/lib/db";

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

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Expenses
        </h2>
        <ExpenseDialog
          buttonVariant="default"
          buttonSize="default"
          showIcon={true}
          className="ml-4"
        />
      </div>

      {/* Expense Categories */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Expense Categories</CardTitle>
          <CardDescription>
            Summary of your expenses by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseCategories expenses={expenses} />
        </CardContent>
      </Card>

      {/* Expense List Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Expense List</CardTitle>
          <CardDescription>
            View and manage your expense entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpensesTable expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  );
}
