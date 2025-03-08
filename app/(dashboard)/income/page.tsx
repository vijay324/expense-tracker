import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IncomeForm } from "@/components/income/income-form";
import { IncomeTable } from "@/components/income/income-table";
import prisma from "@/lib/db";

async function getIncomes() {
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

    // Get all income entries for the user
    const incomes = await prisma.income.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return incomes;
  } catch (error) {
    console.error("Error fetching income:", error);
    return [];
  }
}

export default async function IncomePage() {
  const incomes = await getIncomes();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Income</h2>
      </div>

      {/* Add Income Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Add Income</CardTitle>
          <CardDescription>Add a new income entry</CardDescription>
        </CardHeader>
        <CardContent>
          <IncomeForm />
        </CardContent>
      </Card>

      {/* Income List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Income List</CardTitle>
          <CardDescription>View and manage your income entries</CardDescription>
        </CardHeader>
        <CardContent>
          <IncomeTable incomes={incomes} />
        </CardContent>
      </Card>
    </div>
  );
}
