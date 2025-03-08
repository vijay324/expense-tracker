import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetForm } from "@/components/budget/budget-form";
import { BudgetProgress } from "@/components/budget/budget-progress";
import { BudgetList } from "@/components/budget/budget-list";
import prisma from "@/lib/db";

async function getBudgets() {
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

    // Get all budget entries for the user
    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        year: "desc",
      },
    });

    return budgets;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
}

export default async function BudgetPage() {
  const budgets = await getBudgets();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Budget Planning</h2>
      </div>

      {/* Set Annual Budget Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Set Annual Budget</CardTitle>
          <CardDescription>Set your budget for the year</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetForm />
        </CardContent>
      </Card>

      {/* Budget Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
          <CardDescription>
            Track your spending against your annual budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetProgress />
        </CardContent>
      </Card>

      {/* All Budgets Card */}
      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
          <CardDescription>
            View and manage all your budget entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetList budgets={budgets} />
        </CardContent>
      </Card>
    </div>
  );
}
