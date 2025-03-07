import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Handler } from "typed-route-handler";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: Date;
  createdAt: Date;
  type?: string;
}

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  budgetAmount: number;
  budgetRemaining: number;
  savingsRate: number;
  recentTransactions: Transaction[];
  monthlyData: Array<{
    name: string;
    income: number;
    expenses: number;
  }>;
}

// Get dashboard statistics for the current user
export const GET: Handler<DashboardData> = async (req) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user from our database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      // Return default empty data if user doesn't exist yet
      return NextResponse.json({
        totalIncome: 0,
        totalExpenses: 0,
        budgetAmount: 0,
        budgetRemaining: 0,
        savingsRate: 0,
        recentTransactions: [],
        monthlyData: [],
      });
    }

    // Get current year
    const currentYear = new Date().getFullYear();

    // Get total income for the current year
    const totalIncome = await prisma.income.aggregate({
      where: {
        userId: user.id,
        date: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Get total expenses for the current year
    const totalExpenses = await prisma.expense.aggregate({
      where: {
        userId: user.id,
        date: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Get current year's budget
    const budget = await prisma.budget.findFirst({
      where: {
        userId: user.id,
        year: currentYear,
      },
    });

    // Get recent transactions (both income and expenses)
    const recentIncomes = await prisma.income
      .findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
        select: {
          id: true,
          amount: true,
          category: true,
          description: true,
          date: true,
          createdAt: true,
        },
      })
      .then((incomes: Transaction[]) =>
        incomes.map((income: Transaction) => ({
          ...income,
          type: "income",
        }))
      );

    const recentExpenses = await prisma.expense
      .findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
        select: {
          id: true,
          amount: true,
          category: true,
          description: true,
          date: true,
          createdAt: true,
        },
      })
      .then((expenses: Transaction[]) =>
        expenses.map((expense: Transaction) => ({
          ...expense,
          type: "expense",
        }))
      );

    // Combine and sort recent transactions
    const recentTransactions = [...recentIncomes, ...recentExpenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Get monthly data for the chart
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyData = await Promise.all(
      months.map(async (_, index) => {
        const month = index + 1;

        // Get monthly income
        const monthlyIncome = await prisma.income.aggregate({
          where: {
            userId: user.id,
            date: {
              gte: new Date(
                `${currentYear}-${month.toString().padStart(2, "0")}-01`
              ),
              lt: new Date(
                month === 12
                  ? `${currentYear + 1}-01-01`
                  : `${currentYear}-${(month + 1)
                      .toString()
                      .padStart(2, "0")}-01`
              ),
            },
          },
          _sum: {
            amount: true,
          },
        });

        // Get monthly expenses
        const monthlyExpenses = await prisma.expense.aggregate({
          where: {
            userId: user.id,
            date: {
              gte: new Date(
                `${currentYear}-${month.toString().padStart(2, "0")}-01`
              ),
              lt: new Date(
                month === 12
                  ? `${currentYear + 1}-01-01`
                  : `${currentYear}-${(month + 1)
                      .toString()
                      .padStart(2, "0")}-01`
              ),
            },
          },
          _sum: {
            amount: true,
          },
        });

        return {
          name: months[index],
          income: monthlyIncome._sum.amount || 0,
          expenses: monthlyExpenses._sum.amount || 0,
        };
      })
    );

    // Calculate budget remaining
    const budgetAmount = budget?.amount || 0;
    const expensesAmount = totalExpenses._sum.amount || 0;
    const budgetRemaining = budgetAmount - expensesAmount;

    // Calculate savings rate
    const incomeAmount = totalIncome._sum.amount || 0;
    const savingsRate =
      incomeAmount > 0
        ? Math.round(((incomeAmount - expensesAmount) / incomeAmount) * 100)
        : 0;

    return NextResponse.json({
      totalIncome: incomeAmount,
      totalExpenses: expensesAmount,
      budgetAmount,
      budgetRemaining,
      savingsRate,
      recentTransactions,
      monthlyData,
    });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
