import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { ReportsClient } from "@/components/reports/reports-client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getYearsWithData() {
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
      select: {
        date: true,
      },
    });

    // Get all expense entries for the user
    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
      },
      select: {
        date: true,
      },
    });

    // Extract years from dates
    const incomeYears = incomes.map((income) =>
      new Date(income.date).getFullYear()
    );
    const expenseYears = expenses.map((expense) =>
      new Date(expense.date).getFullYear()
    );

    // Combine and get unique years
    const allYears = [...incomeYears, ...expenseYears];
    const uniqueYears = [...new Set(allYears)].sort((a, b) => b - a); // Sort in descending order

    return uniqueYears;
  } catch (error) {
    console.error("Error fetching years with data:", error);
    return [];
  }
}

export default async function ReportsPage() {
  const yearsWithData = await getYearsWithData();

  // Default to current year if available, otherwise use the most recent year with data
  const currentYear = new Date().getFullYear();
  const defaultYear = yearsWithData.includes(currentYear)
    ? currentYear
    : yearsWithData[0] || currentYear;

  return (
    <ReportsClient yearsWithData={yearsWithData} defaultYear={defaultYear} />
  );
}
