import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Handler } from "typed-route-handler";

// Get all budget entries for the current user
export const GET: Handler = async (req) => {
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
      return new NextResponse("User not found", { status: 404 });
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

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("[BUDGET_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// Create a new budget entry
export const POST: Handler = async (req) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { year, amount } = body;

    if (!year || !amount) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get the user from our database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if a budget for this year already exists
    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: user.id,
        year: parseInt(year),
      },
    });

    if (existingBudget) {
      // Update the existing budget
      const updatedBudget = await prisma.budget.update({
        where: {
          id: existingBudget.id,
        },
        data: {
          amount: parseFloat(amount),
        },
      });

      return NextResponse.json(updatedBudget);
    }

    // Create a new budget entry
    const budget = await prisma.budget.create({
      data: {
        year: parseInt(year),
        amount: parseFloat(amount),
        userId: user.id,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGET_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
